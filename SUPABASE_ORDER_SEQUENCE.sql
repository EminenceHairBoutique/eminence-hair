-- SUPABASE_ORDER_SEQUENCE.sql
--
-- Replaces the COUNT-based order number generation with an atomic Postgres
-- sequence. This prevents duplicate order numbers under concurrent load
-- (e.g. two webhooks racing, Stripe retries, or parallel Vercel invocations).
--
-- Run this once in your Supabase SQL Editor (or via the Supabase CLI).
-- Safe to re-run: uses IF NOT EXISTS guards throughout.
--
-- After applying this migration, update SUPABASE_SERVICE_ROLE_KEY permissions
-- if using a restricted role (the service role already has EXECUTE on functions).

-- ──────────────────────────────────────────────────────────────────────────────
-- 1. Create the sequence (starts at 100001 so the first order is EM-100001-XXXX)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq
  START WITH 100001
  INCREMENT BY 1
  NO MAXVALUE
  CACHE 1;

-- ──────────────────────────────────────────────────────────────────────────────
-- 1a. Seed the sequence based on existing orders so we don't reuse numeric parts
--     from the legacy COUNT-based scheme. Safe to re-run: never moves the
--     sequence backwards and always keeps it at or above 100001.
-- ──────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  _has_orders_column boolean;
  _max_existing_seq  bigint;
  _current_last      bigint;
  _new_start         bigint;
BEGIN
  -- Check that the orders.order_number column exists
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'orders'
      AND column_name  = 'order_number'
  ) INTO _has_orders_column;

  IF _has_orders_column THEN
    -- Extract the numeric portion from EM-<seq>-... order numbers and find the max.
    SELECT COALESCE(
      MAX(
        (regexp_replace(order_number, '^EM-([0-9]+)-.*$', '\1'))::bigint
      ),
      100000  -- so +1 below yields at least 100001 when there are no matches
    ) + 1
    INTO _max_existing_seq
    FROM public.orders
    WHERE order_number ~ '^EM-[0-9]+-';

    -- Get the current last_value of the sequence if it exists.
    BEGIN
      SELECT last_value
      INTO _current_last
      FROM public.order_number_seq;
    EXCEPTION
      WHEN undefined_table OR undefined_object THEN
        _current_last := NULL;
    END;

    -- Choose the highest of the existing max+1, current last_value, and 100001.
    _new_start := GREATEST(
      COALESCE(_max_existing_seq, 100001),
      COALESCE(_current_last, 100001),
      100001
    );

    PERFORM setval('public.order_number_seq', _new_start, true);
  END IF;
EXCEPTION
  WHEN undefined_table OR undefined_object THEN
    -- If orders or the sequence don't exist yet, just skip seeding.
    NULL;
END $$;

-- ──────────────────────────────────────────────────────────────────────────────
-- 2. Helper function that returns the next order number string
--    Format: EM-<seq>-<4-digit timestamp suffix>
--    The suffix adds just enough entropy to make IDs opaque without changing
--    the monotone ordering property of the sequence.
-- ──────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.next_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER   -- runs as the function owner (postgres), bypasses RLS
SET search_path = public
AS $$
DECLARE
  seq_val bigint;
  ts_suffix text;
BEGIN
  seq_val  := nextval('public.order_number_seq');
  -- Last 4 digits of the current Unix epoch in milliseconds
  ts_suffix := right((extract(epoch from clock_timestamp()) * 1000)::bigint::text, 4);
  RETURN 'EM-' || seq_val::text || '-' || ts_suffix;
END;
$$;

-- ──────────────────────────────────────────────────────────────────────────────
-- 3. Grant EXECUTE to the service role so the API can call it
-- ──────────────────────────────────────────────────────────────────────────────
-- Supabase creates a role named "service_role". Adjust if your project differs.
GRANT EXECUTE ON FUNCTION public.next_order_number() TO service_role;

-- ──────────────────────────────────────────────────────────────────────────────
-- 4. (Optional) Unique constraint on orders.order_number
--    Add this only if the column exists and the constraint is not already present.
-- ──────────────────────────────────────────────────────────────────────────────
DO $$
BEGIN
  -- Only add the constraint if the orders table and order_number column exist.
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'orders'
      AND column_name  = 'order_number'
  ) THEN
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage ccu
        ON tc.constraint_name = ccu.constraint_name
      WHERE tc.table_schema   = 'public'
        AND tc.table_name     = 'orders'
        AND tc.constraint_type = 'UNIQUE'
        AND ccu.column_name   = 'order_number'
    ) THEN
      ALTER TABLE public.orders
        ADD CONSTRAINT orders_order_number_unique UNIQUE (order_number);
    END IF;
  END IF;
END $$;
