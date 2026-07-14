import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/seller-dashboard-service";

// Lead status updates from the seller dashboard. The session-bound client
// means RLS ("Sellers update status of inquiries addressed to them") is the
// real gate — the seller_id filter here just makes not-found explicit.
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
  if (!body || !LEAD_STATUSES.includes(body.status as LeadStatus)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("inquiries")
    .update({ status: body.status })
    .eq("id", id)
    .eq("seller_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Couldn't update this lead." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
