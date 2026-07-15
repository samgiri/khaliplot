import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  ShieldCheck,
  Sparkles,
  Zap,
  Check,
  X,
} from "lucide-react";
import SavingsCalculator from "@/components/SavingsCalculator";

export const metadata = {
  title: "Why KhaliPlot | KhaliPlot.in",
  description:
    "Brokers charge 5-10%. Investors 2-5%. KhaliPlot charges ₹499 to reveal a seller and ₹0 commission on the sale. Here's why that's a better deal for buyers and sellers.",
};

const reasons = [
  {
    icon: BadgeIndianRupee,
    title: "Cheapest option",
    text: "₹499 to reveal a seller — versus 2–5% commission that scales with your plot's price. On a ₹50L plot that's ₹499 vs ₹1.5–4 lakh.",
  },
  {
    icon: ShieldCheck,
    title: "Verified listings",
    text: "Listings are checked before they go live, with RERA and land-record trust badges so you can see what a seller has actually declared.",
  },
  {
    icon: Sparkles,
    title: "Smart tools",
    text: "AI price suggestions to sanity-check any asking price, and a built-in Indian unit converter for Guntha, Marla, Bigha and more.",
  },
  {
    icon: Zap,
    title: "Faster deals",
    text: "Direct owner contact cuts the back-and-forth. Sellers report closing in 2–3 weeks instead of the usual 2–3 months.",
  },
];

const comparison = [
  { feature: "Fee", broker: "5–10% commission", investor: "2–5% commission", khaliplot: "₹499 flat" },
  { feature: "Commission on sale", broker: false, investor: false, khaliplot: "₹0" },
  { feature: "Verified listings", broker: false, investor: false, khaliplot: true },
  { feature: "Typical time to close", broker: "2–3 months", investor: "2–3 months", khaliplot: "2–3 weeks" },
  { feature: "Transparent pricing", broker: false, investor: false, khaliplot: true },
  { feature: "AI tools", broker: false, investor: false, khaliplot: true },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check size={18} className="mx-auto text-india-green" />;
  if (value === false) return <X size={18} className="mx-auto text-red" />;
  return <span>{value}</span>;
}

export default function WhyKhaliPlotPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 sm:py-20">
          <p className="coord-label text-green-bright">Why KhaliPlot</p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-5xl">
            Why Choose KhaliPlot?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-paper/75">
            Brokers charge 5–10%. Investors 2–5%. KhaliPlot charges{" "}
            <span className="font-semibold text-amber">₹499 + ₹0</span> commission.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        {/* Problem */}
        <section>
          <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
            The broken real-estate model
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="font-display font-semibold text-navy">Traditional broker (~8%)</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-ink/75">
                <li>₹50L plot → ₹4L commission</li>
                <li>Seller loses ₹4L</li>
                <li>Buyer pays ₹4L extra</li>
                <li className="font-semibold text-red">Total waste: ₹8L</li>
              </ul>
            </div>
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="font-display font-semibold text-navy">Investor (~3%)</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-ink/75">
                <li>₹50L plot → ₹1.5L commission</li>
                <li>Seller loses ₹1.5L</li>
                <li>Buyer pays ₹1.5L extra</li>
                <li className="font-semibold text-red">Total waste: ₹3L</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
            The KhaliPlot model
          </h2>
          <div className="mt-6 rounded-xl border-2 border-navy bg-green-pale p-6 shadow-[6px_6px_0_0_var(--color-navy)] sm:p-8">
            <p className="font-display text-lg font-bold text-navy">
              ₹499 to reveal seller contact · ₹0 commission on sale
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-4">
                <p className="coord-label text-navy/60">Seller gets</p>
                <p className="mt-1 font-display text-xl font-bold text-navy">₹50L (loses ₹0)</p>
              </div>
              <div className="rounded-lg bg-white p-4">
                <p className="coord-label text-navy/60">Buyer pays</p>
                <p className="mt-1 font-display text-xl font-bold text-navy">₹50L (saves ₹1.5–4L)</p>
              </div>
            </div>
            <p className="mt-4 font-display font-bold text-india-green">Both parties win.</p>
          </div>
        </section>

        {/* Four reasons */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
            Four reasons buyers switch
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {reasons.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-line bg-white p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-green-pale text-green">
                  <Icon size={22} />
                </div>
                <h3 className="mt-3 font-display font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-ink/70">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison table */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
            Broker vs Investor vs KhaliPlot
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-navy text-left">
                  <th className="py-3 pr-4 font-display text-navy">Feature</th>
                  <th className="py-3 px-4 text-center font-display text-navy">Broker</th>
                  <th className="py-3 px-4 text-center font-display text-navy">Investor</th>
                  <th className="py-3 px-4 text-center font-display text-navy">KhaliPlot</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-b border-line">
                    <td className="py-3 pr-4 font-semibold text-navy">{row.feature}</td>
                    <td className="py-3 px-4 text-center text-ink/70">
                      <Cell value={row.broker} />
                    </td>
                    <td className="py-3 px-4 text-center text-ink/70">
                      <Cell value={row.investor} />
                    </td>
                    <td className="bg-green-pale/50 py-3 px-4 text-center font-semibold text-navy">
                      <Cell value={row.khaliplot} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Savings calculator */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
            See how much you save
          </h2>
          <p className="mt-2 text-ink/70">Enter your plot price and compare.</p>
          <div className="mt-6">
            <SavingsCalculator />
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 overflow-hidden rounded-xl border-2 border-navy bg-navy px-6 py-10 text-center text-paper sm:px-12">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Ready to save?</h2>
          <p className="mx-auto mt-2 max-w-md text-paper/75">
            Browse verified plots for free, or list yours in about five minutes.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-md bg-amber px-6 py-3 font-semibold text-navy transition-colors hover:bg-amber-dark"
            >
              Browse plots <ArrowRight size={18} />
            </Link>
            <Link
              href="/post-plot"
              className="inline-flex items-center gap-2 rounded-md border-2 border-paper/40 px-6 py-3 font-semibold text-paper transition-colors hover:bg-paper/10"
            >
              List a plot
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
