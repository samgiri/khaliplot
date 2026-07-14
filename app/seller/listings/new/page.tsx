import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/profile-service";
import { isProfileComplete } from "@/lib/profile-data";
import { getLiveListings } from "@/lib/listings-service";
import SellerListingForm from "@/components/SellerListingForm";

export const metadata = {
  title: "New listing | KhaliPlot.in",
  robots: { index: false, follow: false },
};

export default async function NewSellerListingPage() {
  const session = await getSessionProfile();
  if (!session) {
    redirect("/login");
  }
  if (!isProfileComplete(session.profile)) {
    redirect("/welcome");
  }

  const allListings = await getLiveListings();
  const localitySuggestions = Array.from(
    new Map(
      allListings.map((l) => [`${l.city}|${l.locality}`, { city: l.city, locality: l.locality }])
    ).values()
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <p className="coord-label text-green">New listing</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-navy sm:text-3xl">
        List your plot — free
      </h1>
      <p className="mt-1 text-sm text-muted">
        Takes about 5 minutes. Fields marked required must be filled in.
      </p>

      <div className="mt-6">
        <SellerListingForm localitySuggestions={localitySuggestions} />
      </div>
    </div>
  );
}
