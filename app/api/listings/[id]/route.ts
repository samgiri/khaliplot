import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { parseListingFields } from "@/lib/listing-validation";

const STATUS_ACTIONS: Record<string, string> = {
  mark_sold: "sold",
  remove: "removed",
};

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Quick status action (mark sold / soft-delete) — never touches other fields.
  if (typeof body.action === "string") {
    const status = STATUS_ACTIONS[body.action];
    if (!status) {
      return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("listings")
      .update({ status })
      .eq("id", id)
      .eq("seller_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: "Couldn't update this listing." }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  }

  // Full edit — never touches status.
  const parsed = parseListingFields(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("listings")
    .update(parsed.value)
    .eq("id", id)
    .eq("seller_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Couldn't save your changes." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
