import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { generateListingDescription } from "@/lib/anthropic";
import { AREA_UNITS, toSqft, type AreaUnit } from "@/lib/listing-units";
import { plotTypes } from "@/lib/data";

const AREA_UNIT_VALUES = AREA_UNITS.map((u) => u.value) as string[];

// Best-effort in-memory limiter: 5 generations/min per user. Resets on
// serverless instance recycle, same tradeoff as the contact form's limiter.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(userId) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  requestLog.set(userId, recent);
  return recent.length > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  if (isRateLimited(user.id)) {
    return NextResponse.json(
      { error: "Please wait a moment before generating another description." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const plotType = (plotTypes as string[]).includes(body.plotType) ? body.plotType : "Residential";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const state = typeof body.state === "string" ? body.state.trim() : "";
  const locality = typeof body.locality === "string" ? body.locality.trim() : "";
  const areaUnit: AreaUnit = AREA_UNIT_VALUES.includes(body.areaUnit) ? body.areaUnit : "sqft";
  const areaValue = Number(body.areaValue);
  const priceLakh = Number(body.priceLakh);
  const naStatus = typeof body.naStatus === "string" ? body.naStatus : null;
  const hint = typeof body.hint === "string" ? body.hint.trim().slice(0, 400) : "";

  if (!city || !state || !areaValue || areaValue <= 0 || !priceLakh || priceLakh <= 0) {
    return NextResponse.json(
      { error: "Fill in location, size and price first, then generate a description." },
      { status: 400 }
    );
  }

  const areaSqft = toSqft(areaValue, areaUnit);

  const { text, source } = await generateListingDescription({
    plotType,
    city,
    state,
    locality,
    areaSqft,
    areaValue,
    areaUnit,
    priceLakh,
    naStatus,
    hint,
  });

  return NextResponse.json({ description: text, source });
}
