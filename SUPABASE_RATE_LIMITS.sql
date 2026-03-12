-- SUPABASE_RATE_LIMITS.sql
-- Rate-limiting table for Vercel serverless API endpoints.
--
-- PURPOSE:
--   Provides distributed rate limiting across all serverless function instances.
--   Each row stores a (endpoint:ip) key, a request counter, and the window start time.
--   The server-side helper in api/_utils/rateLimit.js reads/writes this table.
--
-- SETUP:
--   Run this script in your Supabase SQL editor (or via CLI migration).
--
-- CLEANUP:
--   Old rows are not automatically deleted. Add a pg_cron job or a Supabase
--   Edge Function scheduler to periodically purge stale entries:
--
--     DELETE FROM rate_limits
--     WHERE window_start < now() - interval '10 minutes';
--
--   Or run the cleanup manually as needed.

CREATE TABLE IF NOT EXISTS rate_limits (
  id           BIGSERIAL    PRIMARY KEY,
  key          TEXT         NOT NULL UNIQUE,           -- "endpoint:ip"
  request_count INTEGER     NOT NULL DEFAULT 0,
  window_start  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast key lookups.
CREATE INDEX IF NOT EXISTS rate_limits_key_idx ON rate_limits (key);

-- Automatically update the updated_at timestamp on every write.
CREATE OR REPLACE FUNCTION update_rate_limits_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS rate_limits_updated_at ON rate_limits;
CREATE TRIGGER rate_limits_updated_at
  BEFORE UPDATE ON rate_limits
  FOR EACH ROW EXECUTE FUNCTION update_rate_limits_timestamp();

-- Row Level Security: only the service role may read/write this table.
-- Client-side access (anon / authenticated) is intentionally blocked.
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- No SELECT/INSERT/UPDATE/DELETE policies for non-service-role roles.
-- The service role bypasses RLS, so the API helpers work correctly.

COMMENT ON TABLE rate_limits IS
  'Distributed rate-limit counters for API endpoints. Managed by api/_utils/rateLimit.js.';
