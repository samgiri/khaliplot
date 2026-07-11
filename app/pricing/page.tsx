import Link from "next/link";
import { Check, Zap, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Pricing | KhaliPlot.in",
  description:
    "Simple, transparent pricing for buyers and sellers on KhaliPlot — browse free, unlock contact reveals, or go unlimited with a Plus plan.",
};

const plusDurations = [
  {
    key: "monthly",
    label: "1 Month",
    price: "₹999",
    period: "/month",
    badge: null,
  },
  {
    key: "100days",
    label: "100 Days",
    price: "₹2,499",
    strike: "₹3,299",
    save: "Save 24%",
    badge: "MOST POPULAR",
  },
  {
    key: "yearly",
    label: "Yearly",
    price: "₹5,999",
    strike: "₹11,999",
    save: "Save 50%",
    badge: "BEST VALUE",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      {/* Founding ribbon */}
      <div className="mb-8 flex items-center justify-center rounded-full bg-amber px-4 py-2 text-center text-sm font-semibold text-navy">
        🏆 Founding 100 — first 100 members get 50% OFF everything
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <p className="coord-label text-green">Pricing</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">
          Simple pricing, no hidden fees
        </h1>
        <p className="mt-3 text-ink/80">
          Browse every plot for free. Pay only when you want to talk directly to a seller.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        {/* Free plan */}
        <div className="flex flex-col rounded-xl border-2 border-navy bg-white p-6 shadow-[6px_6px_0_0_var(--color-line)]">
          <h2 className="font-display text-lg font-bold text-navy">FREE</h2>
          <p className="mt-2 font-display text-3xl font-bold text-navy">₹0</p>
          <ul className="mt-5 space-y-3 text-sm text-ink/80">
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-green" /> Browse all plots
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-green" /> 1 contact reveal / month
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-green" /> Post 2 listings
            </li>
          </ul>
          <Link
            href="/login"
            className="mt-6 rounded-md border-2 border-navy px-6 py-3 text-center font-semibold text-navy transition-colors hover:bg-navy hover:text-paper"
          >
            Get started free
          </Link>
        </div>

        {/* Plus plan with duration toggle */}
        <div className="relative flex flex-col rounded-xl border-2 border-navy bg-white p-6 shadow-[6px_6px_0_0_var(--color-amber)] lg:-mt-4 lg:mb-4">
          <h2 className="font-display text-lg font-bold text-navy">PLUS</h2>
          <p className="mt-1 text-sm text-muted">Unlimited reveals · 10 listings · verified badge · priority in search</p>

          <div className="mt-5 space-y-4">
            {plusDurations.map((d) => (
              <div
                key={d.key}
                className="relative rounded-lg border border-line p-4"
              >
                {d.badge && (
                  <span className="absolute -top-3 right-3 rounded-full bg-amber px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy">
                    {d.badge}
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-navy">{d.label}</span>
                  <div className="text-right">
                    <span className="font-display text-xl font-bold text-navy">{d.price}</span>
                    {d.period && <span className="text-sm text-muted">{d.period}</span>}
                    {d.strike && (
                      <div className="text-xs text-muted">
                        <span className="line-through">{d.strike}</span>{" "}
                        <span className="font-semibold text-green">{d.save}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 rounded-lg bg-green-pale p-3 text-xs text-green">
            <ShieldCheck size={14} className="mr-1 inline align-text-bottom" />
            Trust Guarantee: no genuine response in 90 days? We extend your plan free.
          </p>

          <Link
            href="/login"
            className="mt-6 rounded-md bg-amber px-6 py-3 text-center font-semibold text-navy transition-colors hover:bg-amber-dark"
          >
            Choose Plus
          </Link>
        </div>

        {/* Reveal Pack (compact card) */}
        <div className="flex flex-col rounded-xl border-2 border-navy bg-white p-6 shadow-[6px_6px_0_0_var(--color-line)]">
          <h2 className="font-display text-lg font-bold text-navy">REVEAL PACK</h2>
          <p className="mt-2 font-display text-3xl font-bold text-navy">₹499</p>
          <ul className="mt-5 space-y-3 text-sm text-ink/80">
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-green" /> 10 contact reveals
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-green" /> Valid 90 days
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-green" /> No subscription
            </li>
          </ul>
          <Link
            href="/login"
            className="mt-6 rounded-md border-2 border-navy px-6 py-3 text-center font-semibold text-navy transition-colors hover:bg-navy hover:text-paper"
          >
            Get Reveal Pack
          </Link>
        </div>
      </div>

      {/* Booster banner */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border-2 border-navy bg-navy px-6 py-6 text-paper sm:flex-row sm:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-amber text-navy">
            <Zap size={22} />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">BOOSTER — ₹499 / 7 days</h3>
            <p className="mt-1 text-sm text-paper/70">
              Pin your listing to the top + Featured tag. Works with any package.
            </p>
          </div>
        </div>
        <Link
          href="/login"
          className="shrink-0 rounded-md bg-amber px-6 py-3 font-semibold text-navy transition-colors hover:bg-amber-dark"
        >
          Boost a listing
        </Link>
      </div>
    </div>
  );
}
