import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Compass,
  Ruler,
  Road,
  BadgeCheck,
  Phone,
  Mail,
  MessageCircle,
  ImageOff,
  ArrowLeft,
  ShieldCheck,
  FileCheck2,
  ArrowRight,
} from "lucide-react";
import { formatPrice, formatArea, formatLocation } from "@/lib/data";
import { getLiveListingById, getLiveListings } from "@/lib/listings-service";
import { DOCUMENT_BADGE_LABELS, type DocumentKey } from "@/lib/listing-form-data";
import { getLandRecordLabel } from "@/lib/land-records";
import { getCurrentUserSavedPlotIds, recordListingView } from "@/lib/dashboard-service";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { deriveTrustBadges } from "@/lib/trust-badges";
import PlotCard from "@/components/PlotCard";
import SaveButton from "@/components/SaveButton";
import ReportListingButton from "@/components/ReportListingButton";
import CityLandmark from "@/components/CityLandmark";
import TrustBadges from "@/components/TrustBadges";
import UnitConverterButton from "@/components/UnitConverterModal";

const KHALIPLOT_WHATSAPP = "919625763256";
const KHALIPLOT_PHONE = "+919625763256";
const KHALIPLOT_EMAIL = "hello@khaliplot.in";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getLiveListingById(id);
  if (!listing) return {};
  return {
    title: `${listing.title} | KhaliPlot.in`,
    description: listing.description,
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getLiveListingById(id);
  if (!listing) notFound();

  const allListings = await getLiveListings();
  const similar = allListings
    .filter((l) => l.id !== listing.id && l.city === listing.city)
    .slice(0, 3);

  const savedPlotIds = await getCurrentUserSavedPlotIds();
  const isSaved = savedPlotIds.has(listing.id);

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await recordListingView(supabase, user.id, listing.id);
      }
    } catch {
      // best-effort view tracking — never blocks the page
    }
  }

  const keyFacts = [
    { label: "Area", value: formatArea(listing.areaSqft), icon: Ruler },
    { label: "Dimensions", value: listing.dimensions, icon: Ruler },
    { label: "Facing", value: listing.facing, icon: Compass },
    listing.roadWidthFt > 0 ? { label: "Road width", value: `${listing.roadWidthFt} ft`, icon: Road } : null,
    { label: "Zone", value: listing.zone, icon: ShieldCheck },
    { label: "Price/sqft", value: `₹${listing.pricePerSqft.toLocaleString("en-IN")}`, icon: BadgeCheck },
  ].filter(
    (fact): fact is { label: string; value: string; icon: typeof Ruler } => Boolean(fact && fact.value)
  );

  const documents = listing.documents ?? {};
  const documentBadges = (Object.keys(DOCUMENT_BADGE_LABELS) as DocumentKey[])
    .filter((key) => documents[key])
    .map((key) =>
      key === "land_record" ? `${getLandRecordLabel(listing.state)} extract` : DOCUMENT_BADGE_LABELS[key]
    );
  const ownershipBadges = [
    listing.ownershipType,
    listing.transactionType,
    listing.naStatus === "Yes" ? "NA converted" : null,
  ].filter((b): b is string => Boolean(b));
  const complianceBadges = [...ownershipBadges, ...documentBadges];

  const photos = listing.photoUrls ?? [];

  const trustBadges = deriveTrustBadges(listing);
  const enquiryText = encodeURIComponent(
    `Hi KhaliPlot, I'm interested in "${listing.title}" in ${formatLocation(
      listing.locality,
      listing.city
    )} (listing ${listing.id}). Please connect me with the seller.`
  );
  const whatsappHref = `https://wa.me/${KHALIPLOT_WHATSAPP}?text=${enquiryText}`;
  const emailHref = `mailto:${KHALIPLOT_EMAIL}?subject=${encodeURIComponent(
    `Enquiry: ${listing.title}`
  )}&body=${enquiryText}`;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <Link
        href="/browse"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-green hover:text-navy"
      >
        <ArrowLeft size={16} />
        Back to browse
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          {/* Image gallery */}
          {photos.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:grid-rows-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photos[0]}
                alt={listing.title}
                className="h-64 w-full rounded-lg object-cover sm:col-span-3 sm:row-span-2 sm:h-full"
              />
              {photos.slice(1, 3).map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={url}
                  src={url}
                  alt={listing.title}
                  className="hidden h-32 w-full rounded-lg object-cover sm:block"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:grid-rows-2">
              <div className="plot-border flex h-64 flex-col items-center justify-center gap-2 rounded-lg bg-green-pale text-green/40 sm:col-span-3 sm:row-span-2 sm:h-full">
                <ImageOff size={36} strokeWidth={1.5} />
                <span className="coord-label text-green/50">Main photo — {listing.images} total</span>
              </div>
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="plot-border hidden h-32 items-center justify-center rounded-lg bg-green-pale text-green/40 sm:flex"
                >
                  <ImageOff size={22} strokeWidth={1.5} />
                </div>
              ))}
            </div>
          )}

          {/* Title + price */}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-navy px-2.5 py-1 text-xs font-semibold text-paper">
                  {listing.plotType}
                </span>
                {listing.verified && (
                  <span className="flex items-center gap-1 rounded-full bg-green-bright/90 px-2.5 py-1 text-xs font-semibold text-navy">
                    <BadgeCheck size={14} />
                    Verified
                  </span>
                )}
              </div>
              <h1 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
                {listing.title}
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-muted">
                <CityLandmark city={listing.city} label="" emojiSize={17} />
                {formatLocation(listing.locality, listing.city, listing.state)}
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <div className="text-left sm:text-right">
                <p className="font-display text-3xl font-bold text-navy">
                  {formatPrice(listing.priceLakh)}
                </p>
                <p className="text-sm text-muted">
                  ₹{listing.pricePerSqft.toLocaleString("en-IN")}/sqft
                </p>
              </div>
              <SaveButton plotId={listing.id} initialSaved={isSaved} variant="labeled" />
            </div>
          </div>

          {/* Trust & Verification */}
          {trustBadges.length > 0 && (
            <div className="mt-5 rounded-lg border border-line bg-white p-4">
              <h2 className="flex items-center gap-2 font-display font-semibold text-navy">
                <ShieldCheck size={18} className="text-india-green" />
                Trust &amp; Verification
              </h2>
              <TrustBadges listing={listing} size="md" className="mt-3" />
              <p className="mt-3 text-xs text-muted">
                Based on the seller&apos;s declared documents — always verify independently.
              </p>
            </div>
          )}

          <div className="plot-divider my-6" />

          {/* Key facts */}
          <div className="mb-3 flex items-center justify-between">
            <h2 className="coord-label text-navy/60">Plot details</h2>
            <UnitConverterButton
              label="Convert units"
              initialUnit="sqft"
              initialValue={String(listing.areaSqft)}
              className="inline-flex items-center gap-1.5 rounded-md border border-navy bg-white px-3 py-1.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-paper"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {keyFacts.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-lg border border-line bg-white p-4">
                <Icon size={18} className="text-green" />
                <p className="coord-label mt-2">{label}</p>
                <p className="mt-0.5 font-display font-semibold text-navy">{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-navy">About this plot</h2>
            <p className="mt-2 text-ink/80">{listing.description}</p>
          </div>

          {/* Features */}
          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-navy">Features</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {listing.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Documents & compliance */}
          {complianceBadges.length > 0 && (
            <div className="mt-8">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy">
                <FileCheck2 size={18} className="text-green" />
                Documents &amp; compliance
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {complianceBadges.map((badge) => (
                  <span
                    key={badge}
                    className="flex items-center gap-1.5 rounded-full border border-green-bright bg-green-pale px-3 py-1.5 text-sm font-medium text-green"
                  >
                    <BadgeCheck size={14} />
                    {badge}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted">
                As declared by the seller — always verify documents independently.
              </p>
            </div>
          )}

          {/* Location placeholder */}
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy">
              <MapPin size={18} className="text-green" />
              Location
            </h2>
            <p className="mt-1 text-sm text-muted">
              <CityLandmark
                city={listing.city}
                emojiSize={18}
                label={formatLocation(listing.locality, listing.city, listing.state)}
              />
            </p>
            <div className="plot-border mt-3 flex h-56 flex-col items-center justify-center gap-2 rounded-lg bg-green-pale text-green/50">
              <span aria-hidden="true" className="text-4xl">
                {/* large city landmark */}
                <CityLandmark city={listing.city} label="" emojiSize={40} />
              </span>
              <span className="coord-label text-green/50">
                {listing.coordinates.lat.toFixed(4)}° N, {listing.coordinates.lng.toFixed(4)}° E
              </span>
            </div>
          </div>
        </div>

        {/* Contact card */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-xl border-2 border-navy bg-white p-5 shadow-[6px_6px_0_0_var(--color-amber)]">
            <p className="coord-label text-navy/60">Listed by</p>
            <h3 className="mt-1 font-display text-lg font-semibold text-navy">
              {listing.sellerName}
            </h3>
            <span className="mt-1 inline-block rounded-full bg-green-pale px-2.5 py-1 text-xs font-semibold text-green">
              {listing.sellerType}
            </span>

            <div className="plot-divider my-4" />

            <p className="text-sm text-muted">
              Posted {listing.postedDaysAgo} day{listing.postedDaysAgo !== 1 ? "s" : ""} ago
            </p>
            <p className="mt-2 font-semibold text-navy">
              Talk to the seller directly. No commission. Both win.
            </p>

            {/* Contact — WhatsApp first (Indian buyers prefer it) */}
            <div className="mt-4 space-y-2.5">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 py-3.5 font-display text-base font-bold text-white shadow-md transition-colors hover:bg-whatsapp-hover"
              >
                <MessageCircle size={20} strokeWidth={2.25} />
                Message on WhatsApp
                <ArrowRight size={18} />
              </a>
              <a
                href={`tel:${KHALIPLOT_PHONE}`}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-amber px-4 py-2.5 font-semibold text-navy transition-colors hover:bg-amber-dark"
              >
                <Phone size={16} />
                Call seller
              </a>
              <a
                href={emailHref}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy"
              >
                <Mail size={15} />
                Send email
              </a>
            </div>

            <div className="mt-4 rounded-lg border border-green-bright bg-green-pale p-3 text-xs text-navy">
              After you reveal contact, it&apos;s a direct deal between you and the seller —
              KhaliPlot takes <span className="font-bold">₹0 commission</span> on the sale.
            </div>

            <p className="mt-3 text-center text-xs text-muted">
              Enquiries route through the KhaliPlot team, who connect you with the seller. Your
              number stays private and no brokerage is charged.
            </p>
          </div>
        </div>
      </div>

      {/* Report listing */}
      <div className="mt-8 border-t border-line pt-6 text-center">
        <ReportListingButton listingId={listing.id} />
      </div>

      {/* Similar listings */}
      {similar.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display text-xl font-bold text-navy">
            More plots in {listing.city}
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <PlotCard key={s.id} listing={s} isSaved={savedPlotIds.has(s.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
