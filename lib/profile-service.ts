import { createSupabaseServerClient } from "./supabase-server";
import type { Profile } from "./profile-data";

const PROFILE_COLUMNS =
  "id, email, name, phone, role, state, city, preferred_language, preferred_contact_method";

export interface SessionProfile {
  userId: string;
  email: string | null;
  profile: Profile | null;
}

/**
 * Resolves the signed-in user and their `profiles` row. Returns null when
 * nobody is signed in (or Supabase isn't configured), so callers just
 * redirect to /login on a null result.
 */
export async function getSessionProfile(): Promise<SessionProfile | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", user.id)
      .maybeSingle();

    return {
      userId: user.id,
      email: user.email ?? null,
      profile: (data as Profile) ?? null,
    };
  } catch {
    return null;
  }
}
