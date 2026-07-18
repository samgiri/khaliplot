import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, dbConfigured } from "@/lib/admin-api";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET/PATCH /api/admin/support — the support inbox: contact-form submissions and
// buyer <-> seller inquiries, both stored in `inquiries` and distinguished by
// the `source` column (schema_part1_contact_form.sql). PATCH moves a row through
// the new -> contacted -> closed workflow.

const INQUIRY_COLUMNS =
  "id, source, name, phone, email, inquiry_type, message, status, channel, buyer_id, seller_id, plot_id, created_at";

const STATUSES = ["new", "contacted", "closed"] as const;

interface InquiryRow {
  id: string;
  source: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  inquiry_type: string | null;
  message: string;
  status: string;
  channel: string | null;
  buyer_id: string | null;
  seller_id: string | null;
  plot_id: string | null;
  created_at: string;
}

// GET — list inquiries, newest first. Supports ?source=, ?status= and ?limit=.
export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!dbConfigured()) {
    return NextResponse.json({ live: false, inquiries: [], total: 0 });
  }

  const params = request.nextUrl.searchParams;
  const source = params.get("source")?.trim();
  const status = params.get("status")?.trim();
  const limit = Math.min(Number(params.get("limit")) || 100, 500);

  let query = supabaseAdmin
    .from("inquiries")
    .select(INQUIRY_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (source) query = query.eq("source", source);
  if (status && STATUSES.includes(status as (typeof STATUSES)[number])) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    live: true,
    inquiries: (data ?? []) as InquiryRow[],
    total: count ?? 0,
  });
}

// PATCH — update an inquiry's status. Body: { id, status }.
export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  if (!STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("inquiries")
    .update({ status: body.status })
    .eq("id", body.id)
    .select(INQUIRY_COLUMNS)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ inquiry: data as InquiryRow });
}
