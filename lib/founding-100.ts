import { isSupabaseAdminConfigured, supabaseAdmin } from "@/lib/supabase-admin";

const FOUNDING_100_SEATS = 100;

/**
 * Spots left in the Founding 100 (first 100 members get 50% off everything).
 * Counts `profiles.founding_100_badge = true` via the service-role client —
 * the anon key can't see this across users, RLS restricts profiles to their
 * own row. Falls back to a full 100 if Supabase isn't configured or the
 * query fails, so the pricing page banner always renders.
 */
export async function getFounding100SpotsLeft(): Promise<number> {
  if (!isSupabaseAdminConfigured()) {
    return FOUNDING_100_SEATS;
  }

  try {
    const { count, error } = await supabaseAdmin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("founding_100_badge", true);

    if (error || count === null) {
      return FOUNDING_100_SEATS;
    }

    return Math.max(0, FOUNDING_100_SEATS - count);
  } catch {
    return FOUNDING_100_SEATS;
  }
}
