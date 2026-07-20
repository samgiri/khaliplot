import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Admin client — SERVER-SIDE ONLY. Never import this in client components.
// Uses the service role key, which bypasses Row Level Security, so it can
// insert/update/delete listings regardless of status.
//
// Created lazily so that builds/pages that don't actually call this still
// work even if the env vars aren't set (e.g. local builds without a .env).
let client: SupabaseClient | null = null;

/**
 * True when both env vars the admin client needs are present. Lets callers
 * (e.g. the contact form) return a clear "server not configured" error and log
 * it, instead of a generic failure, when SUPABASE_SERVICE_ROLE_KEY is missing
 * in the deployment environment.
 */
export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

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
