import { NextRequest, NextResponse } from "next/server";
import { createListingReport } from "@/lib/inquiries-service";

// POST /api/listings/[id]/report — flag a listing (spam, sold, fraud, etc).
// Stored via the inquiries-service as an inquiry with source='report_listing'.

const RATE_LIMIT_WINDOW_MS = 60_000;
const lastReportByIp = new Map<string, number>();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ip = getClientIp(request);

  const last = lastReportByIp.get(ip);
  const now = Date.now();
  if (last && now - last < RATE_LIMIT_WINDOW_MS) {
    return NextResponse.json(
      { error: "Please wait a minute before reporting again." },
      { status: 429 }
    );
  }
  lastReportByIp.set(ip, now);

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = await createListingReport(
    { plotId: id, reason: body.reason, details: body.details, reporterEmail: body.email },
    ip
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
