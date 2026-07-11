"use client";

import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client for Client Components (e.g. the login form).
// Created lazily so pages that don't use it still work without env vars set.
let client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
    }

    client = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}
