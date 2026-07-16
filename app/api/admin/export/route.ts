import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAdminOverview } from "@/lib/admin-stats";
import { listings as seedListings } from "@/lib/data";

type ExportType = "users" | "listings" | "reveals" | "revenue";
const TYPES: ExportType[] = ["users", "listings", "reveals", "revenue"];

function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(csvCell).join(",")];
  for (const row of rows) lines.push(row.map(csvCell).join(","));
  return lines.join("\r\n");
}

const dbConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

async function buildCsv(type: ExportType): Promise<string> {
  if (type === "revenue") {
    const overview = await getAdminOverview();
    return toCsv(
      ["date", "revenue_inr"],
      overview.series.revenue.map((p) => [p.date, p.value])
    );
  }

  if (type === "listings") {
    if (!dbConfigured()) {
      return toCsv(
        ["id", "title", "city", "state", "plot_type", "price_lakh", "status", "seller_name"],
        seedListings.map((l) => [l.id, l.title, l.city, l.state, l.plotType, l.priceLakh, l.status ?? "live", l.sellerName])
      );
    }
    const { data } = await supabaseAdmin
      .from("listings")
      .select("id, title, city, state, plot_type, price_lakh, status, seller_name, created_at")
      .order("created_at", { ascending: false });
    return toCsv(
      ["id", "title", "city", "state", "plot_type", "price_lakh", "status", "seller_name", "created_at"],
      (data ?? []).map((l) => [
        l.id, l.title, l.city, l.state, l.plot_type, l.price_lakh, l.status, l.seller_name, l.created_at,
      ])
    );
  }

  if (type === "users") {
    if (!dbConfigured()) {
      const names = Array.from(new Set(seedListings.map((l) => l.sellerName)));
      return toCsv(["name", "role"], names.map((n) => [n, "seller"]));
    }
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("id, name, email, phone, role, location, created_at")
      .order("created_at", { ascending: false });
    return toCsv(
      ["id", "name", "email", "phone", "role", "location", "created_at"],
      (data ?? []).map((u) => [u.id, u.name, u.email, u.phone, u.role, u.location, u.created_at])
    );
  }

  // reveals
  if (!dbConfigured()) {
    return toCsv(["id", "viewer_id", "plot_id", "tier_used", "created_at"], []);
  }
  const { data } = await supabaseAdmin
    .from("contact_reveals")
    .select("id, viewer_id, target_owner_id, plot_id, tier_used, created_at")
    .order("created_at", { ascending: false });
  return toCsv(
    ["id", "viewer_id", "target_owner_id", "plot_id", "tier_used", "created_at"],
    (data ?? []).map((r) => [r.id, r.viewer_id, r.target_owner_id, r.plot_id, r.tier_used, r.created_at])
  );
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const typeParam = request.nextUrl.searchParams.get("type") as ExportType | null;
  if (!typeParam || !TYPES.includes(typeParam)) {
    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
  }

  const csv = await buildCsv(typeParam);
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="khaliplot-${typeParam}-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
