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

// Guard: only create a real client when both vars are present.
// When missing (CI builds, local dev without .env), export a no-op proxy that
// lets the app render without crashing the provider tree.
let supabaseInstance;

if (supabaseUrl && supabaseAnonKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Minimal no-op proxy that satisfies callers expecting a supabase client
  // shape. All async methods return empty/null results instead of throwing.
  const noop = () => Promise.resolve({ data: null, error: null });
  const noopQuery = () => ({ select: noopQuery, insert: noopQuery, update: noopQuery, delete: noopQuery, eq: noopQuery, single: noop, then: (fn) => noop().then(fn) });
  supabaseInstance = {
    auth: {
      getSession: noop,
      getUser: noop,
      signInWithPassword: noop,
      signOut: noop,
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => noopQuery(),
    storage: { from: () => ({ upload: noop, getPublicUrl: () => ({ data: { publicUrl: "" } }) }) },
    functions: { invoke: noop },
  };
}

export const supabase = supabaseInstance;
