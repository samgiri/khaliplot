import { ShieldCheck, FileCheck2, BadgeCheck, Users, type LucideIcon } from "lucide-react";
import { deriveTrustBadges, type TrustTone } from "@/lib/trust-badges";
import type { Listing } from "@/lib/data";

const TONE_STYLES: Record<TrustTone, string> = {
  rera: "bg-india-green text-white",
  "record-712": "bg-blue text-white",
  "record-other": "bg-saffron text-navy",
  verified: "border border-green-bright bg-green-pale text-green",
  owner: "border border-green-bright bg-green-pale text-green",
};

const TONE_ICON: Record<TrustTone, LucideIcon> = {
  rera: ShieldCheck,
  "record-712": FileCheck2,
  "record-other": FileCheck2,
  verified: BadgeCheck,
  owner: Users,
};

/**
 * Renders a listing's trust badges as coloured pills. `max` caps how many
 * show (compact card use); `size="md"` is used in the detail-page section.
 */
export default function TrustBadges({
  listing,
  max,
  size = "sm",
  className = "",
}: {
  listing: Listing;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const all = deriveTrustBadges(listing);
  const badges = typeof max === "number" ? all.slice(0, max) : all;
  if (badges.length === 0) return null;

  const pill =
    size === "md" ? "gap-1.5 px-3 py-1.5 text-sm" : "gap-1 px-2 py-0.5 text-xs";
  const iconSize = size === "md" ? 15 : 12;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {badges.map((badge) => {
        const Icon = TONE_ICON[badge.tone];
        return (
          <span
            key={badge.key}
            className={`inline-flex items-center rounded-full font-semibold ${pill} ${TONE_STYLES[badge.tone]}`}
          >
            <Icon size={iconSize} strokeWidth={2.25} />
            {badge.label}
          </span>
        );
      })}
    </div>
  );
}
