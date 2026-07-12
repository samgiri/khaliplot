import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  PhoneOff,
  Map as MapIcon,
  MessageCircle,
  Mail,
  TreePine,
  Building2,
  Tractor,
  Factory,
  Home as HomeIcon,
  Plane,
  Landmark,
  Gem,
  Sparkles,
  TrendingUp,
  Lock,
  Layers,
  Check,
  Zap,
  CalendarDays,
} from "lucide-react";
import SearchCard from "@/components/SearchCard";
import PlotCard from "@/components/PlotCard";
import GrowthChart from "@/components/GrowthChart";
import { getLiveListings } from "@/lib/listings-service";
import { getPublishedArticles } from "@/lib/news-service";

const plotCategories = [
  { type: "Residential", icon: HomeIcon, description: "NA plots ready for homes" },
  { type: "Agricultural", icon: Tractor, description: "Farmland & orchards" },
  { type: "Commercial", icon: Building2, description: "Shops, offices & showrooms" },
  { type: "Farmhouse", icon: TreePine, description: "Weekend retreats & estates" },
  { type: "Industrial", icon: Factory, description: "Warehousing & factory land" },
];

const trustStrip = [
  { icon: ShieldCheck, title: "Verified listings", text: "Checked for clear title and accurate details before going live." },
  { icon: PhoneOff, title: "No spam calls", text: "Your number stays private until you choose to reveal it." },
  { icon: MapIcon, title: "Map view", text: "See exactly where a plot sits before you plan a visit." },
  { icon: MessageCircle, title: "WhatsApp connect", text: "Reach owners directly — no broker markup, no middlemen." },
];

const primeMarkets = [
  { city: "Mumbai & Navi Mumbai", searchCity: "Navi Mumbai", hook: "The airport effect is live", icon: Plane },
  { city: "Pune", searchCity: "Pune", hook: "India's steadiest plot market outside Mumbai", icon: Building2 },
  { city: "Delhi NCR", searchCity: "Delhi NCR", hook: "Expressways are redrawing the map", icon: Landmark },
  { city: "Neemrana", searchCity: "Neemrana", hook: "90 minutes from Delhi, on the DMIC corridor", icon: Factory },
  { city: "Jaipur", searchCity: "Jaipur", hook: "Heritage city, fast-growing suburbs", icon: Gem },
  { city: "Dholera SIR", searchCity: "Dholera", hook: "India's first greenfield smart city", icon: Sparkles },
];

const plotAdvantages = [
  {
    icon: TrendingUp,
    title: "Land appreciates, structures depreciate",
    text: "A building ages and needs upkeep; the land beneath it tends to gain value over time as the area develops — plots let you invest in that upside directly.",
  },
  {
    icon: Lock,
    title: "Low maintenance, low risk",
    text: "No tenants, no repairs, no society fees. A plot just sits and (typically) appreciates — ideal for long-term wealth building without ongoing hassle.",
  },
  {
    icon: Layers,
    title: "Flexible for the future",
    text: "Build a home, lease it for farming, or hold for resale — vacant land keeps your options open in a way a finished flat never can.",
  },
];

const pricingTeaser = [
  { name: "Free", price: "₹0", note: "1 contact reveal / month" },
  { name: "Plus", price: "from ₹999", note: "Unlimited reveals + verified badge", highlight: true },
  { name: "Reveal Pack", price: "₹499", note: "10 reveals, valid 90 days" },
  { name: "Booster", price: "₹499", note: "Pin your listing to the top for 7 days" },
];

function formatArticleDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default async function Home() {
  const listings = await getLiveListings();
  const recentListings = listings.slice(0, 6);
  const latestArticles = (await getPublishedArticles()).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <div className="reveal">
            <span className="coord-label inline-flex items-center gap-2 rounded-full border border-paper/20 bg-paper/10 px-3 py-1.5 text-green-bright">
              🇮🇳 India&apos;s dedicated plot marketplace
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] text-paper sm:text-5xl lg:text-6xl">
              Find your perfect <span className="text-amber">Khali Plot</span> across India
            </h1>
            <p className="mt-5 max-w-lg text-lg text-paper/70">
              Browse verified residential, agricultural &amp; commercial plots directly from
              owners. Zero brokerage. No spam calls. Pan India coverage.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-md bg-amber px-6 py-3 font-semibold text-navy transition-colors hover:bg-amber-dark"
              >
                Search plots <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-md border-2 border-paper/30 px-6 py-3 font-semibold text-paper transition-colors hover:bg-paper/10"
              >
                <MessageCircle size={18} /> Contact us
              </Link>
            </div>
            <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-paper/60">
              <span>RERA verified listings</span>
              <span aria-hidden="true">·</span>
              <span>Direct owner contact</span>
              <span aria-hidden="true">·</span>
              <span>Zero brokerage</span>
            </p>
          </div>

          <div className="reveal" style={{ animationDelay: "0.15s" }}>
            <SearchCard />
          </div>
        </div>
        <div className="plot-divider-green" />
      </section>

      {/* Browse by plot type */}
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

      {/* Recently added plots */}
      <section className="bg-paper-dim py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="coord-label text-green">Fresh on the market</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
                Recently added plots
              </h2>
            </div>
            <Link
              href="/search"
              className="hidden items-center gap-1.5 font-semibold text-green hover:text-navy sm:flex"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>
          {recentListings.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recentListings.map((listing) => (
                <PlotCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="plot-border rounded-lg bg-white p-12 text-center">
              <p className="font-display text-lg font-semibold text-navy">
                No plots listed yet
              </p>
              <p className="mt-2 text-sm text-muted">Check back soon — new plots go live every week.</p>
            </div>
          )}
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

      {/* Why KhaliPlot trust strip */}
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustStrip.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-lg border border-line bg-white p-6">
              <Icon className="text-green" size={28} />
              <h3 className="mt-3 font-display font-semibold text-navy">{title}</h3>
              <p className="mt-2 text-sm text-ink/70">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why invest in plots & land */}
      <section className="bg-paper-dim py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="coord-label text-green">Why invest in plots &amp; land?</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
                Land has been India&apos;s steadiest store of value
              </h2>
              <p className="mt-3 text-ink/80">
                Across India, well-located plots have historically appreciated faster than
                finished construction — especially near expanding highways, IT corridors and
                pilgrimage routes. As infrastructure reaches a region, the land under it tends
                to re-rate long before new buildings do.
              </p>
              <div className="mt-6 space-y-5">
                {plotAdvantages.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-green-pale text-green">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-navy">{title}</h3>
                      <p className="mt-1 text-sm text-ink/70">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-line bg-white p-5 sm:p-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="coord-label text-green">Illustrative trend</p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-navy">
                    Land price index, 2019–2025
                  </h3>
                </div>
                <span className="rounded-full bg-green-pale px-2.5 py-1 text-xs font-semibold text-green">
                  ~3.6x in 6 yrs
                </span>
              </div>
              <div className="mt-4">
                <GrowthChart />
              </div>
              <p className="mt-3 text-xs text-muted">
                Illustrative composite index for representative Indian plot markets near
                expanding infrastructure corridors. Actual returns vary by location, NA status
                and market conditions — always do independent due diligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prime markets */}
      <section className="bg-navy py-16 text-paper">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="coord-label text-green-bright">Where we operate</p>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
            Pan-India, prime market by prime market
          </h2>
          <p className="mt-3 max-w-2xl text-paper/70">
            One national marketplace, live in India&apos;s highest-growth plot corridors — from
            Mumbai&apos;s new airport belt to Rajasthan&apos;s industrial and smart-city hubs.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {primeMarkets.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.city}
                  href={`/search?city=${encodeURIComponent(item.searchCity)}`}
                  className="group relative rounded-lg border border-paper/15 p-6 transition-colors hover:border-green-bright"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-paper/10 text-green-bright">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold">{item.city}</h3>
                  <p className="mt-2 text-sm text-paper/70">{item.hook}</p>
                  <span className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-green-bright opacity-0 transition-opacity group-hover:opacity-100">
                    Browse plots <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-8 text-center">
          <p className="coord-label text-green">Pricing</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
            Browse free. Pay only to talk to a seller.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pricingTeaser.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-lg border bg-white p-6 text-center ${
                plan.highlight ? "border-2 border-amber shadow-md" : "border-line"
              }`}
            >
              {plan.highlight ? (
                <Zap className="mx-auto text-amber" size={20} />
              ) : (
                <Check className="mx-auto text-green" size={20} />
              )}
              <h3 className="mt-2 font-display font-semibold text-navy">{plan.name}</h3>
              <p className="mt-2 font-display text-2xl font-bold text-navy">{plan.price}</p>
              <p className="mt-1 text-sm text-muted">{plan.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 font-semibold text-green hover:text-navy"
          >
            See full pricing <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Sell CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
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
            href="/post-plot"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-amber px-6 py-3 font-semibold text-navy transition-colors hover:bg-navy hover:text-paper"
          >
            Post your plot <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Latest news & insights */}
      {latestArticles.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="coord-label text-green">News &amp; insights</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
                Latest news &amp; insights
              </h2>
            </div>
            <Link
              href="/news"
              className="hidden items-center gap-1.5 font-semibold text-green hover:text-navy sm:flex"
            >
              View all news <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {latestArticles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="plot-border plot-border-hover group flex flex-col gap-3 rounded-lg bg-white p-5 transition-shadow hover:shadow-md"
              >
                {article.cityTag && (
                  <span className="inline-flex w-fit items-center rounded-full bg-green-pale px-2.5 py-1 text-xs font-semibold text-green">
                    {article.cityTag}
                  </span>
                )}
                <h3 className="font-display text-base font-semibold leading-snug text-navy group-hover:text-green">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-ink/70 line-clamp-3">{article.excerpt}</p>
                )}
                <p className="mt-auto flex items-center gap-1.5 pt-1 text-xs text-muted">
                  <CalendarDays size={13} />
                  {formatArticleDate(article.createdAt)}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 font-semibold text-green hover:text-navy"
            >
              View all news <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* Contact CTA strip */}
      <section className="bg-paper-dim py-14">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <p className="coord-label text-green">Still have questions?</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
            Talk to us directly — no bots, no call centers
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/70">
            Reach out over WhatsApp for a quick reply, or drop us an email — our team responds
            personally.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/919625763256"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-whatsapp px-6 py-3 font-semibold text-white transition-colors hover:bg-whatsapp-hover"
            >
              <MessageCircle size={18} /> WhatsApp us
            </a>
            <a
              href="mailto:hello@khaliplot.in"
              className="inline-flex items-center gap-2 rounded-md border-2 border-navy px-6 py-3 font-semibold text-navy transition-colors hover:bg-navy hover:text-paper"
            >
              <Mail size={18} /> Email us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
