import Link from "next/link";
import { redirect } from "next/navigation";
import { Search, Plus, UserCircle } from "lucide-react";
import { getSessionProfile } from "@/lib/profile-service";
import { isProfileComplete, firstName, ROLE_OPTIONS } from "@/lib/profile-data";

export const metadata = {
  title: "Dashboard | KhaliPlot.in",
  robots: { index: false, follow: false },
};

const quickLinks = [
  { href: "/search", label: "Browse plots", icon: Search },
  { href: "/seller", label: "Post a plot", icon: Plus },
  { href: "/profile", label: "My profile", icon: UserCircle },
];

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

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <p className="coord-label text-green">Dashboard</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-navy sm:text-3xl">
        Namaste, {firstName(profile.name)} 👋
      </h1>
      <span className="mt-3 inline-flex items-center rounded-full bg-green-pale px-3 py-1 text-xs font-semibold text-green">
        {roleLabel}
      </span>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
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

      <div className="mt-8 rounded-xl border-2 border-navy bg-green-pale p-6 text-center sm:p-8">
        <p className="font-display font-semibold text-navy">
          Your full dashboard is coming soon.
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm text-ink/70">
          We&apos;re building saved plots, inquiries and listing management next.
        </p>
      </div>
    </div>
  );
}
