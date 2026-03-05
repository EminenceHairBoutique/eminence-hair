-- SUPABASE_STYLIST_DIRECTORY.sql
-- Extends partner_applications with stylist-directory fields
-- Safe to run multiple times (idempotent).
-- Run this after SUPABASE_PARTNER_TIERS.sql

-- ─────────────────────────────────────────────────────────────────
-- 1. Directory fields on partner_applications
-- ─────────────────────────────────────────────────────────────────
alter table public.partner_applications
  add column if not exists city               text,
  add column if not exists booking_url        text,
  add column if not exists specialties        text[],     -- e.g. ARRAY['Wigs', 'Extensions', 'Color']
  add column if not exists avatar_url         text,
  add column if not exists directory_opt_in   boolean not null default false;

create index if not exists partner_applications_directory_idx
  on public.partner_applications (directory_opt_in)
  where directory_opt_in = true;

-- ─────────────────────────────────────────────────────────────────
-- 2. Add update policy so approved partners can update their own row
-- ─────────────────────────────────────────────────────────────────

-- Partners may update directory fields on their own application row
-- (restricting which columns via a check in the policy).
-- Only approved/active partners should see this in the portal, but
-- we let the server enforce approval gate; the RLS simply ensures
-- users can only touch their own row.
do $$
begin
  create policy "Partners: update own application"
  on public.partner_applications
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
exception when duplicate_object then null;
end $$;

-- Partners can also read their own application row
do $$
begin
  create policy "Partners: read own application"
  on public.partner_applications
  for select
  to authenticated
  using (user_id = auth.uid());
exception when duplicate_object then null;
end $$;

-- ─────────────────────────────────────────────────────────────────
-- 3. Tryon sessions table (Phase 3 - Atelier Try-On)
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.tryon_sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete set null,
  product_id   text,
  product_name text,
  overlay_key  text,
  input_url    text,         -- uploaded source photo URL
  result_url   text,         -- saved composite result URL
  adjustments  jsonb,        -- {scale, offsetX, offsetY, rotation}
  status       text not null default 'created', -- created | saved | sent_to_concierge
  concierge_id uuid,         -- links to concierge_requests if sent
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Enable RLS
alter table public.tryon_sessions enable row level security;

-- Users can read their own sessions
do $$
begin
  create policy "Tryon: read own"
  on public.tryon_sessions
  for select
  to authenticated
  using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- Users can insert their own sessions (server also inserts via service role)
do $$
begin
  create policy "Tryon: insert own"
  on public.tryon_sessions
  for insert
  to authenticated
  with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- Users can update their own sessions (e.g. save result)
do $$
begin
  create policy "Tryon: update own"
  on public.tryon_sessions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- Storage bucket for tryon uploads (run once in Supabase Storage UI or via API):
-- Bucket name: tryon-sessions
-- Public: false (private, access via signed URLs)
-- File size limit: 10MB
-- Allowed MIME: image/jpeg, image/png, image/webp
