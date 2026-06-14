import Link from "next/link";
import { MapPin, Compass, BadgeCheck, ImageOff } from "lucide-react";
import { Listing, formatPrice, formatArea } from "@/lib/data";

export default function PlotCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="plot-border plot-border-hover group flex flex-col overflow-hidden rounded-lg bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative flex h-44 items-center justify-center bg-green-pale">
        <div className="flex flex-col items-center gap-1.5 text-green/40">
          <ImageOff size={28} strokeWidth={1.5} />
          <span className="coord-label text-green/50">{listing.images} photos</span>
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-navy px-2.5 py-1 text-xs font-semibold text-paper">
          {listing.plotType}
        </span>
        {listing.verified && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-green-bright/95 px-2.5 py-1 text-xs font-semibold text-navy">
            <BadgeCheck size={14} />
            Verified
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-base font-semibold leading-snug text-navy group-hover:text-green">
          {listing.title}
        </h3>

        <p className="flex items-center gap-1.5 text-sm text-muted">
          <MapPin size={14} className="shrink-0" />
          {listing.locality}, {listing.city}
        </p>

        <div className="plot-divider my-1" />

        <div className="flex items-center justify-between text-sm">
          <span className="coord-label">{formatArea(listing.areaSqft)}</span>
          <span className="flex items-center gap-1 coord-label">
            <Compass size={12} />
            {listing.facing}
          </span>
          <span className="coord-label">{listing.dimensions}</span>
        </div>

        <div className="mt-1 flex items-baseline justify-between">
          <span className="font-display text-lg font-bold text-navy">
            {formatPrice(listing.priceLakh)}
          </span>
          <span className="text-xs text-muted">₹{listing.pricePerSqft.toLocaleString("en-IN")}/sqft</span>
        </div>
      </div>
    </Link>
  );
}
