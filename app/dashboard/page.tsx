import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Search,
  Plus,
  UserCircle,
  List,
  Eye,
  Heart,
  KeyRound,
  MessageSquare,
  History,
  ArrowRight,
} from "lucide-react";
import { getSessionProfile } from "@/lib/profile-service";
import { isProfileComplete, firstName, ROLE_OPTIONS } from "@/lib/profile-data";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import {
  getSavedPlots,
  getViewedPlotsCount,
  getUserInquiries,
  getUserReveals,
  getMonthlyRevealCount,
  getMonthlyRevealQuota,
} from "@/lib/dashboard-service";
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

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
}: {
  icon: typeof Eye;
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

  const [savedPlots, viewedCount, inquiries, reveals, revealsThisMonth] = await Promise.all([
    getSavedPlots(supabase, session.userId),
    getViewedPlotsCount(supabase, session.userId),
    getUserInquiries(supabase, session.userId),
    getUserReveals(supabase, session.userId),
    getMonthlyRevealCount(supabase, session.userId),
  ]);

  const revealQuota = getMonthlyRevealQuota(subscriptionTier); // null = unlimited
  const revealPct = revealQuota ? Math.min(100, (revealsThisMonth / revealQuota) * 100) : 100;

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
      <p className="coord-label text-green">Dashboard</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-navy sm:text-3xl">
        Namaste, {firstName(profile.name)} 👋
      </h1>
      <span className="mt-3 inline-flex items-center rounded-full bg-green-pale px-3 py-1 text-xs font-semibold text-green">
        {roleLabel}
      </span>

      {/* Overview */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Eye} label="Plots viewed" value={viewedCount} />
        <StatCard icon={Heart} label="Saved plots" value={savedPlots.length} />
        <div className="rounded-lg border border-line bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-pale text-green">
            <KeyRound size={20} />
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-navy">
            {revealQuota === null ? "Unlimited" : `${revealsThisMonth}/${revealQuota}`}
          </p>
          <p className="text-sm text-muted">
            Reveals used{revealQuota === null ? "" : " this month"}
          </p>
          {revealQuota !== null && (
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-paper-dim">
              <div className="h-full rounded-full bg-green" style={{ width: `${revealPct}%` }} />
            </div>
          )}
        </div>
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
              <Link
                key={inquiry.id}
                href={`/listing/${inquiry.plotId}`}
                className="plot-border plot-border-hover flex items-center justify-between gap-4 rounded-lg bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div>
                  <p className="font-display font-semibold text-navy">{inquiry.plotTitle}</p>
                  <p className="mt-0.5 text-sm text-muted">
                    Via {inquiry.channel} · {formatDate(inquiry.createdAt)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${INQUIRY_STATUS_STYLES[inquiry.status] ?? "bg-line text-muted"}`}
                >
                  {inquiry.status}
                </span>
              </Link>
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
