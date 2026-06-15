import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Admin client — SERVER-SIDE ONLY. Never import this in client components.
// Uses the service role key, which bypasses Row Level Security, so it can
// insert/update/delete listings regardless of status.
//
// Created lazily so that builds/pages that don't actually call this still
// work even if the env vars aren't set (e.g. local builds without a .env).
let client: SupabaseClient | null = null;

export const supabaseAdmin = {
  from(table: string) {
    if (!client) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
          "Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
        );
      }

      client = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
    }
    return client.from(table);
  },
};
