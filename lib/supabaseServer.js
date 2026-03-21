import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client using the service role key.
// SUPABASE_URL is the preferred server-side variable name;
// falls back to VITE_SUPABASE_URL so existing deployments continue to work.
export const supabaseServer = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
