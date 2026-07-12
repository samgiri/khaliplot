import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { ROLE_OPTIONS, LANGUAGE_OPTIONS, CONTACT_METHOD_OPTIONS } from "@/lib/profile-data";

const ROLE_VALUES = ROLE_OPTIONS.map((r) => r.value) as string[];
const LANGUAGE_VALUES = LANGUAGE_OPTIONS.map((l) => l.value) as string[];
const CONTACT_METHOD_VALUES = CONTACT_METHOD_OPTIONS.map((c) => c.value) as string[];

export async function PATCH(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phoneDigits = typeof body.phone === "string" ? body.phone.replace(/\D/g, "") : "";
  const role = ROLE_VALUES.includes(body.role) ? body.role : "";
  const state = typeof body.state === "string" ? body.state.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const preferredLanguage = LANGUAGE_VALUES.includes(body.preferredLanguage) ? body.preferredLanguage : "";
  const preferredContactMethod = CONTACT_METHOD_VALUES.includes(body.preferredContactMethod)
    ? body.preferredContactMethod
    : null;

  if (!name || name.length > 100) {
    return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
  }

  const localDigits =
    phoneDigits.length === 12 && phoneDigits.startsWith("91") ? phoneDigits.slice(2) : phoneDigits;
  if (!/^[6-9]\d{9}$/.test(localDigits)) {
    return NextResponse.json(
      { error: "Please enter a valid 10-digit Indian phone number." },
      { status: 400 }
    );
  }

  if (!role) {
    return NextResponse.json({ error: "Please select who you are." }, { status: 400 });
  }
  if (!state) {
    return NextResponse.json({ error: "Please select your state." }, { status: 400 });
  }
  if (!city || city.length > 100) {
    return NextResponse.json({ error: "Please select or enter your city." }, { status: 400 });
  }
  if (!preferredLanguage) {
    return NextResponse.json({ error: "Please select a preferred language." }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      name,
      phone: `+91${localDigits}`,
      role,
      state,
      city,
      preferred_language: preferredLanguage,
      preferred_contact_method: preferredContactMethod,
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: "Couldn't save your profile. Try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
