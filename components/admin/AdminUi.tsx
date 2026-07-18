import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

// Shared presentational pieces for the admin section pages (Transactions,
// Analytics, Content, Support, Reports). Kept framework-neutral (no hooks) so
// they can render inside either server or client components.

/** ₹ formatter: Cr / L / plain, matching the Overview page. */
export function formatINR(n: number): string {
  if (n >= 1_00_00_000)
    return `₹${(n / 1_00_00_000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
  if (n >= 1_00_000)
    return `₹${(n / 1_00_000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

/** Short, readable date. Returns "—" for empty input. */
export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** Truncate a UUID for display (first 8 chars). */
export function shortId(id: string | null | undefined): string {
  return id ? id.slice(0, 8) : "—";
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="coord-label text-navy/50">{label}</p>
        <Icon size={18} className="text-green" />
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-navy">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

export function SectionCard({
  title,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display font-semibold text-navy">
          {Icon && <Icon size={16} className="text-green" />}
          {title}
        </h3>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

type Tone = "green" | "amber" | "muted" | "red";

const TONE_CLASSES: Record<Tone, string> = {
  green: "bg-green-pale text-green",
  amber: "bg-amber/20 text-amber-dark",
  muted: "bg-line text-muted",
  red: "bg-red-100 text-red-700",
};

export function Badge({ children, tone = "muted" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-20 text-muted">
      <Loader2 size={18} className="animate-spin" />
      {label}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber-dark">
      {message}
    </div>
  );
}

export function SampleDataBanner() {
  return (
    <div className="mb-6 rounded-lg border border-amber bg-amber-light/40 p-3 text-sm text-navy">
      Showing sample figures from seed data — connect the database (Supabase env) to see live
      metrics.
    </div>
  );
}

/** Scroll wrapper + base table for the section list views. */
export function DataTable({ head, children }: { head: ReactNode; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left">{head}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Th({ children }: { children: ReactNode }) {
  return <th className="whitespace-nowrap p-3 font-semibold text-navy">{children}</th>;
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`p-3 text-ink/80 ${className}`}>{children}</td>;
}
