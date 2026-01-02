-- Eminence Hair: SMS signups table (optional)
-- Run this in Supabase SQL Editor if you want to store verified phone subscribers.

create table if not exists public.sms_signups (
  id bigserial primary key,
  phone text not null unique,
  consent boolean not null default true,
  source text,
  path text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  metadata jsonb
);

-- Recommended: keep this table private (server writes only)
alter table public.sms_signups enable row level security;

-- No select policies by default.
