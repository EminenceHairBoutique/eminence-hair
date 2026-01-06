-- Eminence Hair: Loyalty + Profiles schema
--
-- Run this in Supabase SQL Editor.
-- Safe to run multiple times (uses IF NOT EXISTS where possible).

-- 1) Profiles table (one row per authenticated user)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  loyalty_points integer not null default 0,
  lifetime_spend_cents bigint not null default 0,
  first_purchase_bonus_awarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- 3) Loyalty ledger (optional but recommended)
create table if not exists public.loyalty_ledger (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  delta integer not null,
  reason text not null,
  order_number text,
  stripe_session_id text,
  created_at timestamptz not null default now()
);

-- 4) Orders table upgrades (only adds columns if missing)
-- NOTE: If you already have an orders table, this will extend it.
-- If you do NOT have one, create it first or adjust accordingly.
alter table public.orders add column if not exists user_id uuid references auth.users(id);
alter table public.orders add column if not exists amount_total bigint;
alter table public.orders add column if not exists currency text;
alter table public.orders add column if not exists order_number text;
alter table public.orders add column if not exists stripe_session_id text;
alter table public.orders add column if not exists items jsonb;
alter table public.orders add column if not exists consent jsonb;
alter table public.orders add column if not exists status text;
alter table public.orders add column if not exists email text;
alter table public.orders add column if not exists created_at timestamptz;

-- 5) RLS policies (recommended)
-- Profiles
alter table public.profiles enable row level security;

drop policy if exists "Profiles: read own" on public.profiles;
create policy "Profiles: read own" on public.profiles
for select using (auth.uid() = id);

drop policy if exists "Profiles: insert own" on public.profiles;
create policy "Profiles: insert own" on public.profiles
for insert with check (auth.uid() = id);

-- Orders (lets a signed-in user read their own orders)
alter table public.orders enable row level security;

drop policy if exists "Orders: read own" on public.orders;
create policy "Orders: read own" on public.orders
for select using (auth.uid() = user_id);

-- Loyalty ledger (read own)
alter table public.loyalty_ledger enable row level security;

drop policy if exists "Ledger: read own" on public.loyalty_ledger;
create policy "Ledger: read own" on public.loyalty_ledger
for select using (auth.uid() = user_id);
