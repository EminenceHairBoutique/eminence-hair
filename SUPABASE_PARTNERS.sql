-- SUPABASE_PARTNERS.sql
-- Partner Program schema helpers
-- Run in Supabase SQL editor.

-- 1) Add partner fields to profiles
alter table public.profiles
  add column if not exists partner_status text not null default 'none',
  add column if not exists partner_tier text;

-- partner_status recommended values:
-- 'none' | 'submitted' | 'approved' | 'rejected'

-- 2) Partner applications table
create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  user_id uuid references auth.users(id) on delete set null,
  full_name text,
  email text,
  phone text,

  business_name text,
  business_type text,
  website text,
  instagram text,
  country text,
  monthly_volume text,
  interest text[],
  branding text,
  notes text,

  status text not null default 'submitted'
);

-- 3) RLS
alter table public.partner_applications enable row level security;

-- Partners can insert their own application, and read their own rows
create policy if not exists "partner_applications_insert_public"
  on public.partner_applications
  for insert
  with check (true);

create policy if not exists "partner_applications_read_own"
  on public.partner_applications
  for select
  using (auth.uid() = user_id);

-- Optional: admins can manage (replace with your own admin check)
-- create policy "partner_applications_admin_all"
--   on public.partner_applications
--   for all
--   using (auth.role() = 'service_role');

-- 4) Recommended: Keep profiles.partner_status in sync manually in Supabase UI
-- Set profiles.partner_status='approved' for approved partner accounts.
