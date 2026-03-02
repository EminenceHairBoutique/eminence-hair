-- SUPABASE_PARTNER_TIERS.sql
-- Partner Tier Ecosystem Migration — safe to run multiple times (idempotent)
-- Run this after SUPABASE_PARTNERS.sql

-- ─────────────────────────────────────────────────────────────────
-- 1. Extend partner_applications with new track + per-track fields
-- ─────────────────────────────────────────────────────────────────
alter table public.partner_applications
  add column if not exists partner_track text,          -- 'stylist' | 'creator'
  add column if not exists license_number text,
  add column if not exists license_state text,
  add column if not exists license_file_url text,
  add column if not exists salon_address text,
  add column if not exists install_volume text,
  add column if not exists hair_types text,
  add column if not exists primary_platform text,
  add column if not exists instagram_handle text,
  add column if not exists tiktok_handle text,
  add column if not exists youtube_url text,
  add column if not exists follower_count text,
  add column if not exists engagement_rate text,
  add column if not exists content_examples text,
  add column if not exists previous_brand_work text,
  add column if not exists referral_code text,
  add column if not exists commission_rate numeric(5,2);

-- ─────────────────────────────────────────────────────────────────
-- 2. Extend profiles with new partner tier fields
-- ─────────────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists partner_track text,          -- 'stylist' | 'creator'
  add column if not exists referral_code text,
  add column if not exists commission_rate numeric(5,2) default 0,
  add column if not exists total_referral_sales numeric(12,2) default 0,
  add column if not exists tier_promoted_at timestamptz;

-- ─────────────────────────────────────────────────────────────────
-- 3. Create partner_tier_history table (audit trail)
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.partner_tier_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  previous_tier text,
  new_tier text not null,
  changed_by uuid references auth.users(id) on delete set null,
  reason text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.partner_tier_history enable row level security;

-- Users can read their own tier history; no client-side writes
drop policy if exists "Users can read own tier history" on public.partner_tier_history;
create policy "Users can read own tier history"
  on public.partner_tier_history
  for select
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────
-- 4. Create creator_referrals table
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.creator_referrals (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.profiles(id) on delete cascade,
  referral_code text not null,
  order_id text,
  order_total numeric(10,2),
  commission_rate numeric(5,2),
  commission_amount numeric(10,2),
  status text not null default 'pending', -- pending, paid, cancelled
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.creator_referrals enable row level security;

-- Creators can read their own referrals; no client-side writes
drop policy if exists "Creators can read own referrals" on public.creator_referrals;
create policy "Creators can read own referrals"
  on public.creator_referrals
  for select
  using (auth.uid() = creator_id);

-- ─────────────────────────────────────────────────────────────────
-- 5. Indexes
-- ─────────────────────────────────────────────────────────────────
create index if not exists partner_applications_track_idx
  on public.partner_applications (partner_track);

create index if not exists creator_referrals_creator_idx
  on public.creator_referrals (creator_id);

create index if not exists creator_referrals_code_idx
  on public.creator_referrals (referral_code);

create index if not exists partner_tier_history_user_idx
  on public.partner_tier_history (user_id);
