import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import SellerDashboardClient from "./SellerDashboardClient";

export const metadata = {
  title: "Seller Dashboard | KhaliPlot.in",
  description: "Manage your plot listings, track leads, and post new plots on KhaliPlot.in.",
  robots: { index: false, follow: false },
};

export default async function SellerPage() {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  if (!configured) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <SellerDashboardClient />;
}
