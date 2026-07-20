import Link from "next/link";
import { Check, Zap, ArrowRight } from "lucide-react";
import TrustBadge from "@/components/pricing/TrustBadge";
import { getFounding100SpotsLeft } from "@/lib/founding-100";

export const dynamic = "force-dynamic";

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

export default async function PricingPage() {
  const spotsLeft = await getFounding100SpotsLeft();

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      {/* Founding ribbon */}
      <div className="mb-8 flex items-center justify-center rounded-full bg-amber px-4 py-2 text-center font-display text-sm font-bold text-navy">
        {spotsLeft > 0 ? (
          <>
            🏆 Founding 100 — only {spotsLeft} spot{spotsLeft === 1 ? "" : "s"} left, 50% off everything
          </>
        ) : (
          <>🏆 Founding 100 is full — thank you for the early trust</>
        )}
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <p className="coord-label text-green">Pricing</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">
          Simple pricing. No hidden fees.
        </h1>
        <p className="mt-3 text-ink/80">
          Pay a small fee to see the seller&apos;s number.{" "}
          <span className="font-semibold text-navy">When the deal closes, we take ₹0.</span>
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        {/* Free plan */}
        <div className="flex flex-col rounded-xl border-2 border-navy bg-white p-6 shadow-[6px_6px_0_0_var(--color-line)]">
          <h2 className="font-display text-lg font-bold text-navy">BROWSE</h2>
          <p className="mt-2 font-display text-3xl font-bold text-navy">FREE</p>
          <ul className="mt-5 space-y-3 text-sm text-ink/80">
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-green" /> Look at as many plots as you want
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-green" /> See photos and prices
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-green" /> Check if a price is fair
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-green" /> Convert land units easily
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-green" /> Save plots you like
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
          <p className="mt-1 text-sm text-muted">
            See every seller&apos;s number · List up to 10 plots · Verified badge · Show up first in search
          </p>

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
                <TrustBadge />
              </div>
            ))}
          </div>

          <Link
            href="/login"
            className="mt-6 rounded-md bg-amber px-6 py-3 text-center font-semibold text-navy transition-colors hover:bg-amber-dark"
          >
            Choose Plus
          </Link>
        </div>

        {/* Reveal Pack (compact card) */}
        <div className="flex flex-col rounded-xl border-2 border-navy bg-white p-6 shadow-[6px_6px_0_0_var(--color-line)]">
          <h2 className="font-display text-lg font-bold text-navy">REVEALS</h2>
          <p className="mt-2 font-display text-3xl font-bold text-navy">₹499</p>
          <ul className="mt-5 space-y-3 text-sm text-ink/80">
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-green" /> 10 seller numbers, valid 90 days
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-green" /> Get the seller&apos;s WhatsApp number
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-green" /> Pay once, no refunds
            </li>
          </ul>
          <Link
            href="/login"
            className="mt-6 rounded-md border-2 border-navy px-6 py-3 text-center font-semibold text-navy transition-colors hover:bg-navy hover:text-paper"
          >
            Buy Reveal Pack
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
              Put your plot at the top of search for 7 days. Works with any plan.
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

      {/* Commission? Zero. */}
      <div className="mt-12 rounded-xl border-2 border-navy bg-green-pale p-6 text-center shadow-[6px_6px_0_0_var(--color-navy)] sm:p-10">
        <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">Commission? Zero.</h2>
        <p className="mx-auto mt-3 max-w-xl text-ink/80">
          When you close the deal, KhaliPlot takes <span className="font-bold text-navy">₹0</span>.
          The seller keeps every rupee. The buyer saves the commission.
        </p>
        <div className="mx-auto mt-6 max-w-2xl overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-navy text-left">
                <th className="py-2.5 pr-4 font-display text-navy">On a ₹50L plot</th>
                <th className="py-2.5 px-4 text-right font-display text-navy">You pay</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line">
                <td className="py-2.5 pr-4 text-ink/75">Broker (8%)</td>
                <td className="py-2.5 px-4 text-right font-semibold text-red">₹4,00,000</td>
              </tr>
              <tr className="border-b border-line">
                <td className="py-2.5 pr-4 text-ink/75">Investor (3%)</td>
                <td className="py-2.5 px-4 text-right font-semibold text-red">₹1,50,000</td>
              </tr>
              <tr className="border-b border-line bg-white">
                <td className="py-2.5 pr-4 font-semibold text-navy">KhaliPlot</td>
                <td className="py-2.5 px-4 text-right font-bold text-india-green">₹499</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Link
          href="/why-khaliplot"
          className="mt-6 inline-flex items-center gap-1.5 font-semibold text-green hover:text-navy"
        >
          Why we charge ₹499, not commission <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
