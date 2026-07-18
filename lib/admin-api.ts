import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";

// Shared helpers for the admin JSON API routes (app/api/admin/*). Every admin
// endpoint is gated behind the same cookie-based session (lib/admin-auth.ts)
// and talks to Supabase through the service-role client (lib/supabase-admin.ts),
// so the guard and the "is the DB even configured?" check live here once.

/**
 * Returns a 401 JSON response when the request has no valid admin session, or
 * `null` when the caller is authenticated. Usage:
 *
 *   const denied = await requireAdmin();
 *   if (denied) return denied;
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/**
 * True when the Supabase service-role client is configured. When false the
 * admin endpoints return `live: false` with empty/seed-derived data instead of
 * throwing, so the dashboard still renders in a fresh environment.
 */
export function dbConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
