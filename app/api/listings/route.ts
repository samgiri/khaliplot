import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getActiveListingLimit } from "@/lib/listings-quota";
import { countActiveSellerListings } from "@/lib/listings-service";
import { roleToSellerType } from "@/lib/profile-data";
import { parseListingFields } from "@/lib/listing-validation";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, phone, role, subscription_tier")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.name || !profile?.phone) {
    return NextResponse.json(
      { error: "Please complete your profile before posting a plot." },
      { status: 400 }
    );
  }

  const activeCount = await countActiveSellerListings(supabase, user.id);
  const limit = getActiveListingLimit(profile.subscription_tier, profile.role);
  if (activeCount >= limit) {
    return NextResponse.json(
      {
        error: `You've reached your limit of ${limit} active listing${limit === 1 ? "" : "s"} on your current plan.`,
        upsell: true,
      },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = parseListingFields(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const fields = parsed.value;

  const sellerType = roleToSellerType(profile.role);

  const { data, error } = await supabase
    .from("listings")
    .insert({
      ...fields,
      verified: false,
      status: "live",
      seller_id: user.id,
      seller_name: profile.name,
      seller_type: sellerType,
      seller_phone: profile.phone,
      dimensions: "",
      zone: "",
      features: [],
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Couldn't publish your plot. Try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
