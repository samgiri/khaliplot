import Link from "next/link";
import {
  ArrowRight,
  Handshake,
  Lightbulb,
  Globe2,
  BarChart3,
  Rocket,
  Mail,
  Phone,
} from "lucide-react";

export const metadata = {
  title: "About us | KhaliPlot.in",
  description:
    "KhaliPlot is on a mission to revolutionise land sales in India — direct connection, a small ₹499 info fee, and ₹0 commission on the sale.",
};

const visionPoints = [
  "Every transaction is transparent",
  "Rural farmers get fair market value",
  "Buyers have verified listings",
  "Technology removes friction",
  "Zero commission traps",
];

const missionPoints = [
  "Democratise land access",
  "Eliminate commission middlemen",
  "Build trust through transparency",
  "Empower rural India",
  "Scale across all of India",
];

const values = [
  { icon: Handshake, title: "Trust", text: "Verified badges and RERA checks on every listing." },
  { icon: Lightbulb, title: "Innovation", text: "AI price suggestions and a built-in unit converter." },
  { icon: Globe2, title: "Inclusion", text: "Built for rural and urban India alike." },
  { icon: BarChart3, title: "Transparency", text: "A flat ₹499 fee and no hidden charges." },
  { icon: Rocket, title: "Impact", text: "Empowering millions of buyers and sellers." },
];

const stats = [
  { value: "2,500+", label: "plots" },
  { value: "₹100+ cr", label: "in transactions" },
  { value: "12", label: "cities" },
  { value: "₹0", label: "commission on sales" },
  { value: "5+", label: "avg. days to close" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 sm:py-20">
          <p className="coord-label text-green-bright">About us</p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-5xl">
            Revolutionising Land Sales in India
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-paper/75">
            Direct connection. Small fee. Zero commission.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        {/* Our story */}
        <section>
          <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">Our story</h2>
          <p className="mt-4 text-ink/80">
            KhaliPlot was born from a simple observation about how land is sold in India:
          </p>
          <ul className="mt-4 space-y-2 text-ink/80">
            <li>• Brokers take 5–10% commission (₹5L on a ₹50L plot!)</li>
            <li>• Investors charge 2–5% (still expensive)</li>
            <li>• Fake listings everywhere</li>
            <li>• No transparency</li>
            <li>• Sellers exploited, buyers overcharged</li>
          </ul>
          <p className="mt-4 rounded-lg border-l-4 border-amber bg-amber-light/40 px-4 py-3 font-semibold text-navy">
            Our solution: a platform with a ₹499 info fee + ₹0 commission on the sale.
          </p>
        </section>

        {/* Vision */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
            India&apos;s most trusted land marketplace
          </h2>
          <p className="mt-3 text-ink/70">We envision a future where:</p>
          <ul className="mt-4 space-y-2">
            {visionPoints.map((p) => (
              <li key={p} className="flex items-start gap-2 text-ink/80">
                <span className="mt-1 text-green">✅</span>
                {p}
              </li>
            ))}
          </ul>
        </section>

        {/* Mission */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">Our mission</h2>
          <ol className="mt-4 space-y-2">
            {missionPoints.map((p, i) => (
              <li key={p} className="flex items-start gap-3 text-ink/80">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-pale text-xs font-bold text-green">
                  {i + 1}
                </span>
                {p}
              </li>
            ))}
          </ol>
        </section>

        {/* Why it works */}
        <section className="mt-12 rounded-xl border-2 border-navy bg-green-pale p-6 shadow-[6px_6px_0_0_var(--color-navy)] sm:p-8">
          <h2 className="font-display text-2xl font-bold text-navy">Why KhaliPlot works</h2>
          <p className="mt-3 text-ink/80">
            <span className="font-semibold">Problem:</span> Brokers 5–10%, investors 2–5%.
            <br />
            <span className="font-semibold">Solution:</span> KhaliPlot ₹499 + ₹0 commission.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-white p-4 text-sm">
              <p className="font-display font-semibold text-navy">Sellers win</p>
              <p className="mt-1 text-ink/70">Keep 100% of the proceeds.</p>
            </div>
            <div className="rounded-lg bg-white p-4 text-sm">
              <p className="font-display font-semibold text-navy">Buyers win</p>
              <p className="mt-1 text-ink/70">Save 2–5%+ in commissions.</p>
            </div>
          </div>
          <Link
            href="/why-khaliplot"
            className="mt-5 inline-flex items-center gap-1.5 font-semibold text-green hover:text-navy"
          >
            See the full comparison <ArrowRight size={16} />
          </Link>
        </section>

        {/* Values */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">Our values</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {values.map(({ icon: Icon, title, text }) => (
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
      </div>

      {/* By the numbers */}
      <section className="bg-navy py-14 text-paper">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">
            KhaliPlot by the numbers
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-bold text-amber">{s.value}</p>
                <p className="mt-1 text-sm text-paper/70">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-paper/50">
            Illustrative launch figures.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">Get in touch</h2>
        <div className="mt-5 flex flex-col gap-3 text-ink/80">
          <a href="mailto:hello@khaliplot.in" className="flex items-center gap-2 hover:text-green">
            <Mail size={18} className="text-green" /> hello@khaliplot.in
          </a>
          <a href="tel:+919625763256" className="flex items-center gap-2 hover:text-green">
            <Phone size={18} className="text-green" /> +91 96257 63256
          </a>
        </div>
        <div className="mt-6">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-amber px-6 py-3 font-semibold text-navy transition-colors hover:bg-amber-dark"
          >
            Contact us <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
