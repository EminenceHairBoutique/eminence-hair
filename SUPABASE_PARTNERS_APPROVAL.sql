-- Eminence Hair: Partner Program (Applications + Approval)
--
-- Run this in Supabase SQL Editor.
-- Safe to run multiple times.
--
-- What this does:
-- 1) Adds partner access fields to public.profiles
-- 2) Creates public.partner_applications (stores application details for admin review)
-- 3) Adds conservative RLS policies (users can read their own application; no public reads)

-- 0) (Optional) UUID helper
create extension if not exists pgcrypto;

-- 1) Profiles columns
alter table public.profiles
  add column if not exists account_tier text not null default 'customer',
  add column if not exists partner_status text not null default 'none',
  add column if not exists partner_tier text;

-- Optional checks
do $$
begin
  alter table public.profiles
    add constraint profiles_account_tier_check
    check (account_tier in ('customer','partner_pending','partner','admin','wholesale') or account_tier like 'partner_%');
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.profiles
    add constraint profiles_partner_status_check
    check (partner_status in ('none','pending','approved','rejected'));
exception when duplicate_object then null;
end $$;

-- Ensure RLS is enabled on profiles (safe if already enabled)
alter table public.profiles enable row level security;

-- Ensure a safe read policy exists (read own)
do $$
begin
  create policy "Profiles: read own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);
exception when duplicate_object then null;
end $$;

-- NOTE: We intentionally DO NOT add an update policy for profiles.
-- Partner approval is handled server-side (service role) so customers cannot promote themselves.

-- 2) Partner applications table
create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,
  full_name text,
  phone text,
  business_name text,
  website_or_instagram text,
  country text,
  monthly_volume text,
  interested_in text,
  message text,
  status text not null default 'pending',
  partner_tier text,
  notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Uniqueness so server can UPSERT by email
create unique index if not exists partner_applications_email_key
on public.partner_applications (email);

create index if not exists partner_applications_status_idx
on public.partner_applications (status);

create index if not exists partner_applications_created_at_idx
on public.partner_applications (created_at desc);

alter table public.partner_applications enable row level security;

-- Users can read their own application
-- (Helpful to show status in the future; no public list access.)
do $$
begin
  create policy "partner_applications_select_own"
  on public.partner_applications
  for select
  to authenticated
  using (user_id = auth.uid());
exception when duplicate_object then null;
end $$;

-- Users can insert their own application (pending only)
-- (Our app primarily submits via /api/partners/apply using the service role; this is a safe fallback.)
do $$
begin
  create policy "partner_applications_insert_own"
  on public.partner_applications
  for insert
  to authenticated
  with check (user_id = auth.uid() and status = 'pending');
exception when duplicate_object then null;
end $$;

-- Grants (RLS still applies)
grant select, insert on public.partner_applications to authenticated;

-- Done.
