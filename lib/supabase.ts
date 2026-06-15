import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Public client — safe to use in the browser. Row Level Security ensures
// this can only read listings where status = 'live'.
//
// Created lazily so pages that don't use it still build/render fine even
// if Supabase env vars aren't configured (e.g. before setup, or in builds
// without a .env file) — callers should check
// process.env.NEXT_PUBLIC_SUPABASE_URL before using this.
let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
    }

    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

export const supabase = {
  from(table: string) {
    return getClient().from(table);
  },
};
