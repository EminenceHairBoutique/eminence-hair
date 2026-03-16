import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const noopResult = { data: null, error: { message: "Supabase not configured" } };
const noopPromise = () => Promise.resolve(noopResult);

const noopProxy = {
  from: () => ({
    select: noopPromise,
    insert: noopPromise,
    update: noopPromise,
    delete: noopPromise,
    upsert: noopPromise,
  }),
  auth: {
    getUser: noopPromise,
    getSession: noopPromise,
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: noopPromise,
    signUp: noopPromise,
    signOut: noopPromise,
  },
};

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : noopProxy;
