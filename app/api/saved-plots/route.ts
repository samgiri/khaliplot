import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const plotId = typeof body?.plotId === "string" ? body.plotId : "";
  const action = body?.action === "unsave" ? "unsave" : "save";

  if (!plotId) {
    return NextResponse.json({ error: "Missing plotId." }, { status: 400 });
  }

  if (action === "save") {
    const { error } = await supabase
      .from("saved_plots")
      .upsert({ buyer_id: user.id, plot_id: plotId }, { onConflict: "buyer_id,plot_id", ignoreDuplicates: true });

    if (error) {
      return NextResponse.json({ error: "Couldn't save this plot." }, { status: 500 });
    }
    return NextResponse.json({ ok: true, saved: true });
  }

  const { error } = await supabase
    .from("saved_plots")
    .delete()
    .eq("buyer_id", user.id)
    .eq("plot_id", plotId);

  if (error) {
    return NextResponse.json({ error: "Couldn't remove this plot." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, saved: false });
}
