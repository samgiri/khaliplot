import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Compass,
  Ruler,
  Road,
  BadgeCheck,
  Phone,
  MessageCircle,
  ImageOff,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { formatPrice, formatArea } from "@/lib/data";
import { getLiveListingById, getLiveListings } from "@/lib/listings-service";
import PlotCard from "@/components/PlotCard";

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

  const keyFacts = [
    { label: "Area", value: formatArea(listing.areaSqft), icon: Ruler },
    { label: "Dimensions", value: listing.dimensions, icon: Ruler },
    { label: "Facing", value: listing.facing, icon: Compass },
    { label: "Road width", value: `${listing.roadWidthFt} ft`, icon: Road },
    { label: "Zone", value: listing.zone, icon: ShieldCheck },
    { label: "Price/sqft", value: `₹${listing.pricePerSqft.toLocaleString("en-IN")}`, icon: BadgeCheck },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <Link
        href="/search"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-green hover:text-navy"
      >
        <ArrowLeft size={16} />
        Back to search
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          {/* Image gallery placeholder */}
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
                <MapPin size={15} />
                {listing.locality}, {listing.city}, {listing.state}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-display text-3xl font-bold text-navy">
                {formatPrice(listing.priceLakh)}
              </p>
              <p className="text-sm text-muted">
                ₹{listing.pricePerSqft.toLocaleString("en-IN")}/sqft
              </p>
            </div>
          </div>

          <div className="plot-divider my-6" />

          {/* Key facts */}
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

          {/* Location placeholder */}
          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-navy">Location</h2>
            <div className="plot-border mt-3 flex h-56 flex-col items-center justify-center gap-2 rounded-lg bg-green-pale text-green/40">
              <MapPin size={28} strokeWidth={1.5} />
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

            <p className="text-sm text-muted">Posted {listing.postedDaysAgo} day{listing.postedDaysAgo !== 1 ? "s" : ""} ago</p>
            <p className="mt-3 flex items-center gap-2 font-display text-lg font-bold text-navy">
              <Phone size={16} className="text-green" />
              {listing.sellerPhone}
            </p>

            <div className="mt-5 flex flex-col gap-2.5">
              <button className="flex items-center justify-center gap-2 rounded-md bg-green px-4 py-3 font-semibold text-paper transition-colors hover:bg-navy">
                <Phone size={18} />
                Call seller
              </button>
              <button className="flex items-center justify-center gap-2 rounded-md border border-green bg-green-pale px-4 py-3 font-semibold text-green transition-colors hover:bg-green hover:text-paper">
                <MessageCircle size={18} />
                WhatsApp
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-muted">
              KhaliPlot connects you directly with the seller. No brokerage charged for browsing.
            </p>
          </div>
        </div>
      </div>

      {/* Similar listings */}
      {similar.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display text-xl font-bold text-navy">
            More plots in {listing.city}
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <PlotCard key={s.id} listing={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
