import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const INQUIRY_TYPES = ["buying", "selling", "listing", "pricing", "partnership", "other"] as const;
type InquiryType = (typeof INQUIRY_TYPES)[number];

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

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const inquiryType: InquiryType = INQUIRY_TYPES.includes(body.inquiryType)
    ? body.inquiryType
    : "other";

  if (!name || name.length > 100) {
    return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
  }
  if (!message || message.length > 2000) {
    return NextResponse.json({ error: "Please enter a message." }, { status: 400 });
  }
  if (!phone && !email) {
    return NextResponse.json(
      { error: "Please provide a phone number or an email." },
      { status: 400 }
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }

  try {
    const { error } = await supabaseAdmin.from("inquiries").insert({
      source: "contact_form",
      name,
      phone: phone || null,
      email: email || null,
      inquiry_type: inquiryType,
      message,
    });

    if (error) {
      return NextResponse.json({ error: "Couldn't save your message." }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Couldn't save your message." }, { status: 500 });
  }
}
