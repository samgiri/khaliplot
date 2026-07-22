import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { isProfileComplete, type Profile } from "@/lib/profile-data";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    // Most commonly: the link was opened in a different browser/device than
    // the one that requested it, so the PKCE code_verifier cookie set at
    // send-time isn't present here to match the code. Send them back with a
    // flag so the login page explains what happened instead of silently
    // dumping them on a blank sign-in form.
    return NextResponse.redirect(`${origin}/login?error=expired`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=expired`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, phone, role, state, city, preferred_language")
    .eq("id", user.id)
    .maybeSingle();

  const destination = isProfileComplete(profile as Profile | null) ? "/dashboard" : "/welcome";
  return NextResponse.redirect(`${origin}${destination}`);
}
