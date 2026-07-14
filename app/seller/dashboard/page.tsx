import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSellerListings } from "@/lib/listings-service";
import { getActiveListingLimit } from "@/lib/listings-quota";
import { getSellerLeads, getListingViewCounts } from "@/lib/seller-dashboard-service";
import SellerDashboard from "@/components/SellerDashboard";

export const metadata = {
  title: "Seller Dashboard | KhaliPlot.in",
  robots: { index: false, follow: false },
};

export default async function SellerDashboardPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, role")
    .eq("id", user.id)
    .maybeSingle();

  const [listings, leads] = await Promise.all([
    getSellerListings(supabase, user.id),
    getSellerLeads(supabase, user.id),
  ]);

  const activeCount = listings.filter((l) => l.status === "live").length;
  const limit = getActiveListingLimit(profile?.subscription_tier, profile?.role);
  const viewCounts = await getListingViewCounts(listings.map((l) => l.id));

  const leadCounts: Record<string, number> = {};
  for (const lead of leads) {
    leadCounts[lead.plotId] = (leadCounts[lead.plotId] ?? 0) + 1;
  }

  return (
    <SellerDashboard
      initialListings={listings}
      activeCount={activeCount}
      limit={limit}
      viewCounts={Object.fromEntries(viewCounts)}
      leadCounts={leadCounts}
      totalLeads={leads.length}
      newLeads={leads.filter((l) => l.status === "new").length}
    />
  );
}
