import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // In development, surface a clear message rather than crashing with an
  // unhelpful "Invalid URL" or "undefined" error from the Supabase client.
  console.warn(
    "[Eminence] Supabase env vars are missing. " +
      "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file. " +
      "Auth and database features will be unavailable."
  );
}

// Provide fallback placeholder values so createClient doesn't throw when env
// vars are missing (e.g., during CI builds or local dev without a .env file).
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
