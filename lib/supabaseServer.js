import { createClient } from "@supabase/supabase-js";

// Prefer the server-only SUPABASE_URL env var.
// Fall back to VITE_SUPABASE_URL only for environments where both exist.
// Fail loudly at startup if neither is set — a missing URL will cause every
// server-side Supabase call to silently return errors instead of throwing,
// which makes debugging very hard.
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl) {
  console.error(
    "❌ FATAL: SUPABASE_URL (or VITE_SUPABASE_URL) is not set. " +
      "Server-side Supabase calls will fail. Set SUPABASE_URL in your environment."
  );
}

if (!supabaseServiceRoleKey) {
  console.error(
    "❌ FATAL: SUPABASE_SERVICE_ROLE_KEY is not set. " +
      "Server-side Supabase calls will fail. Set SUPABASE_SERVICE_ROLE_KEY in your environment."
  );
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);
