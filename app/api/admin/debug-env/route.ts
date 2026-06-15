import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";

// TEMPORARY debug route — reveals only whether env vars are SET (not their
// values) to help diagnose configuration issues. Remove after debugging.
export async function GET() {
  const ok = await isAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "ADMIN_PASSWORD",
    "ADMIN_SESSION_SECRET",
  ];

  const status: Record<string, { set: boolean; length: number; preview: string }> = {};
  for (const key of keys) {
    const value = process.env[key];
    status[key] = {
      set: value !== undefined && value !== "",
      length: value?.length ?? 0,
      preview: value ? `${value.slice(0, 4)}...${value.slice(-4)}` : "",
    };
  }

  return NextResponse.json({ env: status });
}
