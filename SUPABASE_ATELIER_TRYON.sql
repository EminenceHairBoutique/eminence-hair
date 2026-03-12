-- ============================================================
-- Eminence Hair: Atelier Mirror – Virtual Try-On Schema
-- ============================================================
-- Run this in the Supabase SQL Editor (or via supabase db push).
-- Safe to run multiple times (uses IF NOT EXISTS / DO blocks).
--
-- Tables created:
--   1. public.tryon_sessions   – one record per try-on interaction
--   2. public.fit_profiles     – optional per-user fit preferences
-- ============================================================

-- 0) Ensure pgcrypto is available (for gen_random_uuid)
create extension if not exists pgcrypto;

-- ============================================================
-- 1. tryon_sessions
-- ============================================================

create table if not exists public.tryon_sessions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz,

  -- User (nullable for anonymous try-ons)
  user_id         uuid references auth.users(id) on delete set null,

  -- Product / provider
  product_id      text not null,
  product_name    text,
  overlay_key     text,
  provider        text not null default 'mediapipe',

  -- Session mode
  mode            text not null default 'quick'
                  check (mode in ('quick', 'live', 'review')),

  -- Storage paths (Supabase Storage, signed URL on retrieval)
  selfie_path     text,   -- source image path in tryon-sessions bucket
  result_path     text,   -- composite result image path

  -- Alternative: direct URL from canvas export (before upload)
  result_url      text,

  -- Detected face data (client-side, never sent to external servers)
  landmarks       jsonb,   -- serialised FaceMetrics.landmarks subset

  -- User refinement values
  adjustments     jsonb,   -- { scale, offsetX, offsetY, rotation }

  -- Free-form extra data (overlay variant, parting, density, etc.)
  metadata        jsonb,

  -- Concierge link
  concierge_id    uuid,   -- FK to concierge_requests.id (added below)

  -- Status lifecycle
  status          text not null default 'created'
                  check (status in (
                    'created', 'processing', 'saved',
                    'sent_to_concierge', 'archived'
                  ))
);

-- Indexes for common query patterns
create index if not exists tryon_sessions_user_id_idx
  on public.tryon_sessions (user_id);

create index if not exists tryon_sessions_product_id_idx
  on public.tryon_sessions (product_id);

create index if not exists tryon_sessions_created_at_idx
  on public.tryon_sessions (created_at desc);

-- ── Auto-update updated_at on row changes ─────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$ begin
  create trigger tryon_sessions_set_updated_at
    before update on public.tryon_sessions
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger fit_profiles_set_updated_at
    before update on public.fit_profiles
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- ── Row-Level Security ─────────────────────────────────────────────────────

alter table public.tryon_sessions enable row level security;

-- Users can read their own sessions
do $$ begin
  create policy "tryon_sessions: read own"
    on public.tryon_sessions for select
    to authenticated
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Users can insert their own sessions (or anon sessions where user_id IS NULL)
do $$ begin
  create policy "tryon_sessions: insert own"
    on public.tryon_sessions for insert
    to authenticated
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Users can update their own sessions
do $$ begin
  create policy "tryon_sessions: update own"
    on public.tryon_sessions for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Service role (server functions) can do anything – handled implicitly.
-- Anonymous sessions are managed server-side (service role only).

-- ============================================================
-- 2. fit_profiles  (optional per-user preference store)
-- ============================================================

create table if not exists public.fit_profiles (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null unique references auth.users(id) on delete cascade,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz,

  cap_size            text,   -- e.g. "average", "petite", "large"
  preferred_density   text,   -- e.g. "150%", "180%", "200%"
  preferred_lace      text,   -- e.g. "HD lace", "transparent lace", "5x5"
  parting_preference  text,   -- e.g. "middle", "side", "free"
  face_shape          text,   -- e.g. "oval", "round", "square", "heart", "diamond"
  notes               text
);

-- Indexes
create index if not exists fit_profiles_user_id_idx
  on public.fit_profiles (user_id);

-- ── Row-Level Security ─────────────────────────────────────────────────────

alter table public.fit_profiles enable row level security;

do $$ begin
  create policy "fit_profiles: read own"
    on public.fit_profiles for select
    to authenticated
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "fit_profiles: insert own"
    on public.fit_profiles for insert
    to authenticated
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "fit_profiles: update own"
    on public.fit_profiles for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- ============================================================
-- 3. Supabase Storage: tryon-sessions bucket
-- ============================================================
-- Run these statements once in the SQL editor, or create the bucket
-- via the Supabase dashboard (Storage → New bucket).
--
-- NOTE: The bucket should be PRIVATE (no public access).
--       All reads must go through signed URLs generated server-side.
-- ============================================================

-- insert into storage.buckets (id, name, public)
--   values ('tryon-sessions', 'tryon-sessions', false)
--   on conflict (id) do nothing;

-- Policy: authenticated users can upload to their own path
-- insert into storage.policies (name, bucket_id, definition)
--   values (
--     'tryon-sessions: user upload',
--     'tryon-sessions',
--     'bucket_id = ''tryon-sessions'' AND auth.uid()::text = (string_to_array(name, ''/''::text))[1]'
--   ) on conflict do nothing;

-- ============================================================
-- 4. Optional: add concierge_id FK to tryon_sessions
--    (only needed if concierge_requests table already exists)
-- ============================================================

do $$ begin
  alter table public.tryon_sessions
    add constraint tryon_sessions_concierge_id_fk
    foreign key (concierge_id)
    references public.concierge_requests(id)
    on delete set null;
exception when undefined_table then null;
        when duplicate_object then null; end $$;

-- ============================================================
-- Done!
-- ============================================================
-- ENV VARS REQUIRED (add to .env.local and Vercel project settings):
--
--   VITE_SUPABASE_URL          – your Supabase project URL
--   VITE_SUPABASE_ANON_KEY     – Supabase anon key (public)
--   SUPABASE_SERVICE_ROLE_KEY  – server-side only, for API routes
--
-- OPTIONAL:
--   VITE_TRYON_PROVIDER        – "mediapipe" (default) or future enterprise key
--   SUPABASE_ATELIER_BUCKET    – override the default "atelier-uploads" bucket
-- ============================================================
