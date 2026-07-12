import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSellerListings } from "@/lib/listings-service";
import { getActiveListingLimit } from "@/lib/listings-quota";
import MyListingsClient from "./MyListingsClient";

export const metadata = {
  title: "My Listings | KhaliPlot.in",
  robots: { index: false, follow: false },
};

export default async function MyListingsPage() {
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

  const listings = await getSellerListings(supabase, user.id);
  const activeCount = listings.filter((l) => l.status === "live").length;
  const limit = getActiveListingLimit(profile?.subscription_tier, profile?.role);

  return (
    <MyListingsClient initialListings={listings} activeCount={activeCount} limit={limit} />
  );
}
