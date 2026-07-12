import { MapPin, Users, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "About us | KhaliPlot.in",
  description:
    "KhaliPlot is India's plot-only marketplace — live in prime markets pan-India, built for direct owner-to-buyer contact with no broker spam.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="coord-label text-green">About us</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">
        India&apos;s plot-only marketplace
      </h1>

      <div className="mt-6 space-y-4 text-ink/80">
        <p>
          Most property sites bury plot listings under thousands of flats and apartments.
          KhaliPlot is different — we only do vacant land. Every filter, every feature and every
          listing on this site exists to help you buy or sell a plot, faster and with less noise.
        </p>
        <p>
          We started in Lonavla, Maharashtra, and have grown into a pan-India marketplace — live
          in prime markets from Mumbai and Navi Mumbai to Pune, Delhi NCR, Neemrana, Jaipur and
          Dholera, with new markets added as demand grows.
        </p>
        <p>
          KhaliPlot connects buyers directly with plot owners. No broker markup, no recycled
          listings copy-pasted across five different sites, and no spam calls the moment you show
          interest in a plot. Your number stays private until you choose to share it.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-line bg-white p-6">
          <MapPin className="text-green" size={26} />
          <h3 className="mt-3 font-display font-semibold text-navy">Pan-India coverage</h3>
          <p className="mt-2 text-sm text-ink/70">
            Live in Mumbai, Navi Mumbai, Pune, Delhi NCR, Jaipur, Neemrana, Dholera and more.
          </p>
        </div>
        <div className="rounded-lg border border-line bg-white p-6">
          <Users className="text-green" size={26} />
          <h3 className="mt-3 font-display font-semibold text-navy">Direct contact</h3>
          <p className="mt-2 text-sm text-ink/70">
            Buyers and owners talk to each other directly — no middleman in between.
          </p>
        </div>
        <div className="rounded-lg border border-line bg-white p-6">
          <ShieldCheck className="text-green" size={26} />
          <h3 className="mt-3 font-display font-semibold text-navy">No broker spam</h3>
          <p className="mt-2 text-sm text-ink/70">
            We verify listings before they go live and keep your contact details private.
          </p>
        </div>
      </div>
    </div>
  );
}
