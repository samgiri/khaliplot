import { NextRequest, NextResponse } from "next/server";
import { createContactInquiry } from "@/lib/inquiries-service";

// Best-effort in-memory limiter: resets whenever the serverless instance
// recycles, but still blocks rapid resubmits within a warm instance.
const RATE_LIMIT_WINDOW_MS = 60_000;
const lastSubmissionByIp = new Map<string, number>();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const last = lastSubmissionByIp.get(ip);
  const now = Date.now();
  if (last && now - last < RATE_LIMIT_WINDOW_MS) {
    return true;
  }
  lastSubmissionByIp.set(ip, now);
  return false;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Please wait a minute before sending another message." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = await createContactInquiry(
    {
      name: body.name,
      phone: body.phone,
      email: body.email,
      inquiryType: body.inquiryType,
      message: body.message,
    },
    ip
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
