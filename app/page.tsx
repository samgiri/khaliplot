import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck, IndianRupee, Users, TreePine, Building2, Tractor, Factory, Home as HomeIcon } from "lucide-react";
import SearchCard from "@/components/SearchCard";
import PlotMapIllustration from "@/components/PlotMapIllustration";
import PlotCard from "@/components/PlotCard";
import { listings } from "@/lib/data";

const plotCategories = [
  { type: "Residential", icon: HomeIcon, description: "NA plots ready for homes" },
  { type: "Agricultural", icon: Tractor, description: "Farmland & orchards" },
  { type: "Commercial", icon: Building2, description: "Shops, offices & showrooms" },
  { type: "Farmhouse", icon: TreePine, description: "Weekend retreats & estates" },
  { type: "Industrial", icon: Factory, description: "Warehousing & factory land" },
];

const stats = [
  { label: "Active listings", value: "120+" },
  { label: "Cities live", value: "1" },
  { label: "Weekly inquiries", value: "20+" },
  { label: "Brokerage charged", value: "₹0" },
];

const cityRoadmap = [
  { city: "Lonavla", status: "Live now", note: "Home turf — zero organised digital competition" },
  { city: "Pune", status: "Next up", note: "65 km away, highest plot volume, IT buyer base" },
  { city: "Nashik", status: "Phase 3", note: "Kumbh Mela 2026 demand, agricultural land hub" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <div className="reveal">
            <span className="coord-label inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-green">
              <MapPin size={13} />
              Now live in Lonavla, Maharashtra
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] text-navy sm:text-5xl lg:text-6xl">
              Empty land,
              <br />
              <span className="text-green">full possibilities.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink/80">
              India&apos;s plot marketplace — built only for vacant land. Browse verified plots,
              talk directly to owners, and skip the apartment listings that clutter every other
              property site.
            </p>
            <div className="mt-8">
              <SearchCard />
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl font-bold text-navy">{stat.value}</p>
                  <p className="text-xs text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal hidden lg:block" style={{ animationDelay: "0.15s" }}>
            <PlotMapIllustration className="w-full" />
          </div>
        </div>
        <div className="plot-divider-green" />
      </section>

      {/* Plot categories */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="coord-label text-green">Browse by type</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
              What kind of plot are you after?
            </h2>
          </div>
          <Link
            href="/search"
            className="hidden items-center gap-1.5 font-semibold text-green hover:text-navy sm:flex"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {plotCategories.map(({ type, icon: Icon, description }) => (
            <Link
              key={type}
              href={`/search?type=${type}`}
              className="plot-border plot-border-hover group flex flex-col gap-3 rounded-lg bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-green-pale text-green group-hover:bg-green group-hover:text-paper">
                <Icon size={22} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-navy">{type}</h3>
                <p className="mt-1 text-sm text-muted">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      <section className="bg-paper-dim py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="coord-label text-green">Fresh on the market</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
                Featured plots in Lonavla &amp; nearby
              </h2>
            </div>
            <Link
              href="/search"
              className="hidden items-center gap-1.5 font-semibold text-green hover:text-navy sm:flex"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {listings.slice(0, 4).map((listing) => (
              <PlotCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 font-semibold text-green hover:text-navy"
            >
              View all listings <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why KhaliPlot / About */}
      <section id="about" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="coord-label text-green">Why KhaliPlot</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
            Built only for plots — because land deserves its own marketplace
          </h2>
          <p className="mt-3 text-ink/80">
            General property portals bury plot listings under thousands of flats and apartments.
            KhaliPlot is different: every listing, filter and feature exists to help you buy or
            sell vacant land — faster, with less noise.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-line bg-white p-6">
            <ShieldCheck className="text-green" size={28} />
            <h3 className="mt-3 font-display font-semibold text-navy">Verified listings</h3>
            <p className="mt-2 text-sm text-ink/70">
              Plots are checked for clear title, NA conversion status and accurate dimensions
              before they go live.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-white p-6">
            <Users className="text-green" size={28} />
            <h3 className="mt-3 font-display font-semibold text-navy">Direct from owners</h3>
            <p className="mt-2 text-sm text-ink/70">
              Talk to the seller directly. No middleman markup, no recycled broker listings
              across five different sites.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-white p-6">
            <IndianRupee className="text-green" size={28} />
            <h3 className="mt-3 font-display font-semibold text-navy">Zero brokerage to browse</h3>
            <p className="mt-2 text-sm text-ink/70">
              Search, compare and shortlist plots for free. Sellers list their first plots at no
              cost too.
            </p>
          </div>
        </div>
      </section>

      {/* City roadmap */}
      <section className="bg-navy py-16 text-paper">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="coord-label text-green-bright">Where we operate</p>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
            Expanding city by city, not all at once
          </h2>
          <p className="mt-3 max-w-2xl text-paper/70">
            We go deep before we go wide — a new city only opens once the current one has 200+
            active listings and steady weekly inquiries.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {cityRoadmap.map((item, i) => (
              <div key={item.city} className="relative rounded-lg border border-paper/15 p-6">
                <span className="coord-label text-green-bright">
                  {item.status === "Live now" ? "● Live now" : `Phase ${i + 1}`}
                </span>
                <h3 className="mt-2 font-display text-xl font-bold">{item.city}</h3>
                <p className="mt-2 text-sm text-paper/70">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sell CTA */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="overflow-hidden rounded-xl border-2 border-navy bg-green-pale px-6 py-12 text-center shadow-[6px_6px_0_0_var(--color-navy)] sm:px-12">
          <p className="coord-label text-green">For landowners</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
            Got an empty plot? List it free in 5 minutes.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/70">
            Reach buyers actively searching for land in your area. No listing fees, no
            commission on your first plots.
          </p>
          <Link
            href="/seller"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-amber px-6 py-3 font-semibold text-navy transition-colors hover:bg-navy hover:text-paper"
          >
            Post your plot <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
