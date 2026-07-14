import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSellerLeads } from "@/lib/seller-dashboard-service";
import SellerLeadsList from "@/components/SellerLeadsList";

export const metadata = {
  title: "Leads | KhaliPlot.in",
  robots: { index: false, follow: false },
};

export default async function SellerLeadsPage() {
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

  const leads = await getSellerLeads(supabase, user.id);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/seller/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-green hover:text-navy"
      >
        <ArrowLeft size={16} />
        Seller dashboard
      </Link>
      <p className="coord-label mt-4 text-green">Leads</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-navy sm:text-3xl">Buyer inquiries</h1>
      <p className="mt-1 text-sm text-muted">
        Everyone who has reached out about your plots. Mark leads as you work through them.
      </p>

      <div className="mt-6">
        <SellerLeadsList initialLeads={leads} />
      </div>
    </div>
  );
}
