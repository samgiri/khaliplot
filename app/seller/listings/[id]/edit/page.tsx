import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/profile-service";
import { isProfileComplete } from "@/lib/profile-data";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSellerListingById, getLiveListings } from "@/lib/listings-service";
import SellerListingForm from "@/components/SellerListingForm";

export const metadata = {
  title: "Edit listing | KhaliPlot.in",
  robots: { index: false, follow: false },
};

export default async function EditSellerListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSessionProfile();
  if (!session) {
    redirect("/login");
  }
  if (!isProfileComplete(session.profile)) {
    redirect("/welcome");
  }

  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const initial = (await getSellerListingById(supabase, id, session.userId)) ?? null;
  if (!initial) {
    redirect("/seller/dashboard");
  }

  const allListings = await getLiveListings();
  const localitySuggestions = Array.from(
    new Map(
      allListings.map((l) => [`${l.city}|${l.locality}`, { city: l.city, locality: l.locality }])
    ).values()
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <p className="coord-label text-green">Edit plot</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-navy sm:text-3xl">
        Edit your listing
      </h1>
      <p className="mt-1 text-sm text-muted">
        Takes about 5 minutes. Fields marked required must be filled in.
      </p>

      <div className="mt-6">
        <SellerListingForm editingId={id} initial={initial} localitySuggestions={localitySuggestions} />
      </div>
    </div>
  );
}
