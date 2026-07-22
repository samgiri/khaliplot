import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Search,
  Plus,
  UserCircle,
  List,
  Heart,
  MessageSquare,
  KeyRound,
  History,
  ArrowRight,
} from "lucide-react";
import { getSessionProfile } from "@/lib/profile-service";
import { isProfileComplete, firstName, ROLE_OPTIONS } from "@/lib/profile-data";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import {
  getSavedPlots,
  getUserInquiries,
  getUserReveals,
  getMonthlyRevealCount,
  getMonthlyRevealQuota,
  getCurrentPackage,
} from "@/lib/dashboard-service";
import { packageLabel } from "@/lib/package-types";
import PlotCard from "@/components/PlotCard";

export const metadata = {
  title: "Dashboard | KhaliPlot.in",
  robots: { index: false, follow: false },
};

const quickLinks = [
  { href: "/search", label: "Browse plots", icon: Search },
  { href: "/post-plot", label: "Post a plot", icon: Plus },
  { href: "/my-listings", label: "My listings", icon: List },
  { href: "/profile", label: "My profile", icon: UserCircle },
];

const INQUIRY_STATUS_STYLES: Record<string, string> = {
  new: "bg-amber/20 text-amber-dark",
  contacted: "bg-green-pale text-green",
  closed: "bg-line text-muted",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** "23 days left" / "Expires today" / "Expired" / "No expiry" for the package status card. */
function daysLeftText(expiresAt: string | null): string {
  if (!expiresAt) return "No expiry";
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) return "Expired";
  const days = Math.ceil(diffMs / 86_400_000);
  return days === 0 ? "Expires today" : `${days} day${days === 1 ? "" : "s"} left`;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
}: {
  icon: typeof MessageSquare;
  label: string;
  value: string | number;
  sublabel?: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-pale text-green">
        <Icon size={20} />
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-navy">{value}</p>
      <p className="text-sm text-muted">{sublabel ?? label}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getSessionProfile();
  if (!session) {
    redirect("/login");
  }
  if (!isProfileComplete(session.profile)) {
    redirect("/welcome");
  }

  const profile = session.profile!;
  const roleLabel = ROLE_OPTIONS.find((r) => r.value === profile.role)?.label ?? profile.role;

  const supabase = await createSupabaseServerClient();
  const { data: tierRow } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", session.userId)
    .maybeSingle();
  const subscriptionTier = tierRow?.subscription_tier ?? "free";

  const [savedPlots, inquiries, reveals, revealsThisMonth, currentPackage] = await Promise.all([
    getSavedPlots(supabase, session.userId),
    getUserInquiries(supabase, session.userId),
    getUserReveals(supabase, session.userId),
    getMonthlyRevealCount(supabase, session.userId),
    getCurrentPackage(supabase, session.userId),
  ]);

  const revealQuota = getMonthlyRevealQuota(subscriptionTier); // null = unlimited
  const revealsRemaining = revealQuota === null ? null : Math.max(0, revealQuota - revealsThisMonth);
  const remainingPct = revealQuota === null ? 100 : Math.min(100, Math.max(0, (revealsRemaining! / revealQuota) * 100));

  const packageTier = currentPackage?.tier ?? subscriptionTier;
  const packageDisplayName = packageLabel(currentPackage?.packageKey ?? null, packageTier);
  const packageExpiryText = daysLeftText(currentPackage?.expiresAt ?? null);

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
      <p className="coord-label text-green">Dashboard</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-navy sm:text-3xl">
        Namaste, {firstName(profile.name)} 👋
      </h1>
      <span className="mt-3 inline-flex items-center rounded-full bg-green-pale px-3 py-1 text-xs font-semibold text-green">
        {roleLabel}
      </span>

      {/* Package & quota status */}
      <div className="mt-8 rounded-xl border-2 border-navy bg-white p-6 shadow-[6px_6px_0_0_var(--color-amber)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="coord-label text-green">Your package</p>
            <p className="mt-1 font-display text-2xl font-bold text-navy">{packageDisplayName}</p>
            <p className="mt-1 text-sm text-muted">{packageExpiryText}</p>
          </div>
          <Link
            href="/pricing"
            className="rounded-md bg-amber px-5 py-2.5 font-semibold text-navy transition-colors hover:bg-amber-dark"
          >
            Upgrade package
          </Link>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-navy">Reveals remaining</span>
            <span className="text-muted">
              {revealQuota === null ? "Unlimited" : `${revealsRemaining}/${revealQuota}`}
            </span>
          </div>
          {revealQuota !== null && (
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-paper-dim">
              <div className="h-full rounded-full bg-green" style={{ width: `${remainingPct}%` }} />
            </div>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Heart} label="Saved plots" value={savedPlots.length} />
        <StatCard icon={MessageSquare} label="Inquiries sent" value={inquiries.length} />
        <StatCard
          icon={KeyRound}
          label="Reveals left"
          value={revealQuota === null ? "Unlimited" : `${revealsRemaining}/${revealQuota}`}
        />
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="plot-border plot-border-hover flex flex-col items-start gap-3 rounded-lg bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-green-pale text-green">
              <Icon size={22} />
            </div>
            <p className="font-display font-semibold text-navy">{label}</p>
          </Link>
        ))}
      </div>

      {/* Saved plots */}
      <section className="mt-12">
        <h2 className="font-display text-lg font-bold text-navy">Saved plots</h2>
        {savedPlots.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {savedPlots.map(({ listing }) => (
              <PlotCard key={listing.id} listing={listing} isSaved />
            ))}
          </div>
        ) : (
          <div className="plot-border mt-4 rounded-lg bg-white p-8 text-center">
            <p className="font-display font-semibold text-navy">No saved plots yet</p>
            <p className="mt-1 text-sm text-muted">
              Tap the heart on any plot to save it here — it&apos;ll show up on any device you sign
              in on.
            </p>
            <Link
              href="/search"
              className="mt-4 inline-flex items-center gap-1.5 font-semibold text-green hover:text-navy"
            >
              Browse plots <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {/* My inquiries */}
      <section className="mt-12">
        <h2 className="font-display text-lg font-bold text-navy">My inquiries</h2>
        {inquiries.length > 0 ? (
          <div className="mt-4 space-y-3">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="plot-border rounded-lg bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Link
                      href={`/listing/${inquiry.plotId}`}
                      className="font-display font-semibold text-navy hover:text-green"
                    >
                      {inquiry.plotTitle}
                    </Link>
                    <p className="mt-0.5 text-sm text-muted">
                      To {inquiry.sellerName || "Seller"} · Via {inquiry.channel} ·{" "}
                      {formatDate(inquiry.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${INQUIRY_STATUS_STYLES[inquiry.status] ?? "bg-line text-muted"}`}
                  >
                    {inquiry.status}
                  </span>
                </div>
                {inquiry.message.trim() && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-semibold text-green hover:text-navy">
                      View message
                    </summary>
                    <p className="mt-1.5 whitespace-pre-wrap text-sm text-ink/80">{inquiry.message}</p>
                  </details>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="plot-border mt-4 flex items-center gap-4 rounded-lg bg-white p-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-green-pale text-green">
              <MessageSquare size={22} />
            </div>
            <div>
              <p className="font-display font-semibold text-navy">No inquiries yet</p>
              <p className="mt-1 text-sm text-muted">
                Messages you send to sellers will show up here.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Reveal history */}
      <section className="mt-12">
        <h2 className="font-display text-lg font-bold text-navy">Reveal history</h2>
        {reveals.length > 0 ? (
          <div className="mt-4 space-y-3">
            {reveals.map((reveal) => (
              <Link
                key={reveal.id}
                href={`/listing/${reveal.plotId}`}
                className="plot-border plot-border-hover flex items-center justify-between gap-4 rounded-lg bg-white p-4 transition-shadow hover:shadow-md"
              >
                <p className="font-display font-semibold text-navy">{reveal.plotTitle}</p>
                <p className="text-sm text-muted">{formatDate(reveal.createdAt)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="plot-border mt-4 flex items-center gap-4 rounded-lg bg-white p-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-green-pale text-green">
              <History size={22} />
            </div>
            <div>
              <p className="font-display font-semibold text-navy">No reveals yet</p>
              <p className="mt-1 text-sm text-muted">
                Contact reveals aren&apos;t live yet — once they are, they&apos;ll show up here.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
