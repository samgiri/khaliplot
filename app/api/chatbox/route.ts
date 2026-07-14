import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Chat sends several small messages per visit, so the window is much shorter
// than the contact form's — just enough to stop scripted flooding.
const RATE_LIMIT_WINDOW_MS = 2_000;
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
    return NextResponse.json({ error: "Slow down a little." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const reply = typeof body.reply === "string" ? body.reply.trim() : "";

  if (!message || message.length > 500 || reply.length > 1000) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  try {
    const { error } = await supabaseAdmin.from("inquiries").insert({
      source: "chatbox",
      name: "Chatbox visitor",
      message: `User: ${message}\nBot: ${reply}`,
    });

    if (error) {
      return NextResponse.json({ error: "Couldn't save the message." }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Couldn't save the message." }, { status: 500 });
  }
}
