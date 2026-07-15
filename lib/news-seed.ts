import type { NewsArticle } from "@/lib/news-service";

// Bundled launch articles. Used as a fallback so /news and /news/[slug] work
// before (or without) a configured `news_articles` table — mirrors how
// lib/data.ts seeds listings. `cityTag` doubles as the category label shown
// in the news filter pills.
export const seedArticles: NewsArticle[] = [
  {
    id: "seed-why-499",
    slug: "why-we-charge-499",
    title: "Why We Charge ₹499, Not 5% Commission",
    cityTag: "Business",
    excerpt:
      "A broker takes ₹4 lakh on a ₹50 lakh plot. We take ₹499 to reveal the seller and ₹0 on the sale. Here's why that maths works.",
    content: `The Indian land market runs on commission — and commission scales with the deal, not the effort. A broker who spends the same week closing a ₹20 lakh plot and a ₹2 crore plot earns ten times more on the second one for no extra work. That's not a service fee; it's a tax on the size of your land.

## The KhaliPlot model

We charge a flat **₹499 to reveal a seller's contact**, and **₹0 commission on the sale**. That's it.

- On a ₹50 lakh plot, a broker at 8% takes **₹4,00,000**.
- An investor-aggregator at 3% takes **₹1,50,000**.
- KhaliPlot takes **₹499** — and nothing when you close.

## Why a flat fee is fair

Revealing a verified seller's contact costs us the same whether the plot is ₹5 lakh or ₹5 crore. So we price for that work, not for the size of your transaction. You keep the commission you would have lost.

## How we stay sustainable

Thousands of small, honest reveal fees — plus optional Plus subscriptions and listing boosts for sellers who want more visibility — fund the platform. No single deal makes or breaks us, so we have no incentive to push you into a bad one.

Simple, transparent, and aligned with both buyer and seller. When you win, we don't take a cut of it.`,
    createdAt: "2026-07-12T09:00:00Z",
  },
  {
    id: "seed-unit-guide",
    slug: "unit-converter-guide",
    title: "Guntha, Marla, Bigha? Your Complete Unit Converter Guide",
    cityTag: "Education",
    excerpt:
      "India measures land in a dozen different units, and they change from state to state. Here's what each one means — and how to compare them instantly.",
    content: `Buy land in Maharashtra and you'll hear "Guntha". In Punjab it's "Marla". Across the north it's "Bigha" — except a Bigha in Rajasthan isn't a Bigha in West Bengal. This patchwork is one of the most confusing parts of buying a plot in India.

## The common units

- **1 Guntha = 1,089 sqft** (Maharashtra) — 40 Guntha make an acre.
- **1 Marla = 272.25 sqft** (Punjab & Haryana).
- **1 Bigha ≈ 14,400 sqft** (varies widely by state — always confirm locally).
- **1 Katha ≈ 1,620 sqft** (Bihar & UP).
- **1 Gaj = 9 sqft** (a square yard, common in Gujarat & the north).
- **1 Ground = 2,400 sqft** (Tamil Nadu & the south).
- **1 Acre = 43,560 sqft**, and **1 Hectare = 107,639 sqft**.

## Why it matters for price

Sellers often quote price *per unit* — ₹ per Guntha, per Marla, per Gaj. If you can't convert quickly, you can't compare two plots, and you can't tell whether a "cheap" per-Gaj rate is actually expensive per sqft.

## Convert in one tap

Every plot on KhaliPlot has a **Unit Converter** built in — enter any value in any unit and see all the others instantly, with a copy button for each. No spreadsheets, no guesswork.`,
    createdAt: "2026-07-11T09:00:00Z",
  },
  {
    id: "seed-fake-listings",
    slug: "spot-fake-listings",
    title: "How to Spot Fake Plot Listings",
    cityTag: "Buyer Tips",
    excerpt:
      "Fake and recycled listings are the biggest frustration in Indian real estate. Here are the red flags — and how verification protects you.",
    content: `If a plot looks too cheap, too urgent, or too good to be true, it usually is. Fake listings waste your time, and some are outright scams. Here's how to tell.

## Red flags to watch for

1. **Price far below the area rate.** Scammers use a low price to get you to call fast.
2. **Pressure to pay a "token" immediately** to "hold" the plot. Never pay to hold a plot you haven't seen and verified.
3. **No documents offered.** A genuine seller can show a 7/12 extract, sale deed, or the local land record.
4. **Stock photos** or images that appear on multiple listings across sites.
5. **Vague location** — "near the highway" with no map pin or survey number.
6. **Refusal to meet on-site.**

## How KhaliPlot reduces the risk

- Listings are checked before they go live, and verified ones carry a **Verified** badge.
- **RERA** and **land-record** trust badges show which documents the seller has declared.
- Seller phone numbers stay private until you reveal them, cutting spam.

## Your checklist before paying anything

Visit the plot. Match the survey number to the land record. Confirm NA/zoning status. Verify the seller owns it. **Never** transfer money to KhaliPlot or any intermediary — payments happen directly between you and the seller.`,
    createdAt: "2026-07-10T09:00:00Z",
  },
  {
    id: "seed-success-rahul",
    slug: "success-story-rahul",
    title: "Success Story: How Rahul Sold His Farmland in 2 Weeks",
    cityTag: "Success Stories",
    excerpt:
      "Rahul had listed his 2-acre farm with three brokers for eight months. On KhaliPlot it sold in 14 days — with zero commission.",
    content: `Rahul owns two acres of farmland near Kune village, outside Lonavla. For eight months it sat with three different brokers, each promising buyers who never showed up — and each expecting a slice of the sale.

## The problem

"Every broker wanted 2% from me and 2% from the buyer," Rahul says. "So buyers were quoted more than my asking price, and I was getting less. The deal kept dying in the middle."

## What changed

He listed the plot himself on KhaliPlot — free — with photos, the 7/12 extract, and an honest price. The listing went live with a **Verified** badge after a quick check.

Serious buyers paid ₹499 to reveal his WhatsApp and messaged him directly. No broker in the middle inflating the price.

## The result

- **14 days** from listing to a signed agreement.
- **₹0 commission** — Rahul kept his full asking price.
- The buyer saved roughly **₹1.8 lakh** versus a broker deal.

"Both of us walked away happy," he says. "That never happened with brokers."

*Names and details shared with permission; some specifics changed for privacy.*`,
    createdAt: "2026-07-09T09:00:00Z",
  },
  {
    id: "seed-prices-2026",
    slug: "plot-prices-2026",
    title: "Plot Prices in 2026: Market Report by City",
    cityTag: "Market Data",
    excerpt:
      "Where plot prices are heading in Delhi NCR, Mumbai, Pune, Jaipur and Bengaluru — and which corridors are drawing buyers.",
    content: `Land continues to outperform built property in India's fast-growing corridors, especially where new infrastructure is arriving. Here's a snapshot by market.

## Delhi NCR

Expressways keep redrawing the map. Plots along the Dwarka Expressway and the Neemrana–Behror industrial belt (on the DMIC corridor) are seeing the strongest interest as connectivity improves.

## Mumbai & Navi Mumbai

The new Navi Mumbai airport belt — Ulwe, Panvel and around — remains the headline story, with NA plots commanding a premium for their proximity.

## Pune

India's steadiest plot market outside Mumbai. Hinjawadi, Wagholi and the ring-road villages continue to attract end-users and investors alike.

## Jaipur

Heritage city, fast-growing suburbs. JDA-approved layouts in Vaishali Nagar and along the Ring Road are the safe picks.

## Bengaluru

Sarjapur Road and the tech corridors drive demand; BMRDA-approved plots carry a clear premium for the paperwork certainty.

## The takeaway

Prices follow infrastructure. A plot re-rates when a highway, airport or metro reaches it — often long before new buildings appear. Use KhaliPlot's **AI price suggestion** to sanity-check any asking price against the local rate.

*Illustrative market commentary — always do independent due diligence before buying.*`,
    createdAt: "2026-07-08T09:00:00Z",
  },
  {
    id: "seed-documents",
    slug: "land-documents-guide",
    title: "7/12 Extract, Satbara, RERA: Land Documents Explained",
    cityTag: "Education",
    excerpt:
      "The paperwork that actually protects you when buying a plot in India — what each document is, and why it matters.",
    content: `Buying land without checking documents is the single biggest mistake first-time buyers make. Here's the essential paperwork, in plain language.

## 7/12 Extract (Satbara)

In Maharashtra, Gujarat and Goa, the **7/12 extract** — "Satbara" — is the core land record. It shows who owns the plot, its area, and any loans or disputes registered against it. In other states the equivalent goes by different names: **Jamabandi** (Rajasthan, Punjab, Haryana), **Khasra/Khatauni** (UP, MP), **RTC/Pahani** (Karnataka), **Patta/Chitta** (Tamil Nadu).

## Sale Deed

The registered document that actually transfers ownership. A clear chain of sale deeds proves the seller has the right to sell.

## Encumbrance Certificate (EC)

Shows whether the plot is free of legal or financial liabilities — mortgages, court cases, unpaid dues.

## Mutation

Confirms the land records have been updated to the current owner's name after the last transfer.

## RERA registration

For plots sold as part of an approved layout or project, **RERA** registration adds a layer of regulatory protection and transparency.

## How KhaliPlot helps

Listings display **trust badges** — RERA Verified, 7/12 Ready, and the state-specific land record — so you can see at a glance what a seller has declared. Always verify the originals in person before you pay.`,
    createdAt: "2026-07-07T09:00:00Z",
  },
  {
    id: "seed-direct-vs-broker",
    slug: "direct-owner-vs-broker",
    title: "Direct Owner vs Broker: Why Direct Wins",
    cityTag: "Buying Tips",
    excerpt:
      "Buying directly from the owner saves money and cuts the noise. Here's why — and how to negotiate well when you do.",
    content: `When you buy directly from the person who owns the land, two good things happen: the price drops, and the information gets better.

## The money

A broker deal typically adds 4–8% to the transaction once both sides' commissions are counted. Buy direct and that margin stays in your pocket — or becomes room to negotiate.

## The information

The owner knows the plot: why they're selling, what the neighbours are like, where the boundary stones sit, whether the road floods in monsoon. A broker juggling fifty listings rarely does.

## How to negotiate direct

1. **Do your homework first.** Know the per-sqft rate for the area (KhaliPlot's AI price suggestion helps).
2. **Ask for documents up front** — 7/12, sale deed, EC. A serious owner has them ready.
3. **Visit the plot** and match the survey number to the record.
4. **Make a fair, specific offer.** Direct sellers respond better to a real number than to lowballing.

## Finding direct owners

On KhaliPlot, listings from owners carry a **Direct Owner** badge. Filter for them, reveal the contact for ₹499, and message on WhatsApp — no middleman, no markup, ₹0 commission on the sale.`,
    createdAt: "2026-07-06T09:00:00Z",
  },
  {
    id: "seed-launch",
    slug: "khaliplot-launch",
    title: "KhaliPlot Launches: India's Transparent Plot Marketplace",
    cityTag: "Announcements",
    excerpt:
      "We're building the land marketplace India actually needs — verified listings, direct contact, AI tools, and ₹0 commission.",
    content: `Today we're launching KhaliPlot — a marketplace built for one thing only: buying and selling vacant land in India, honestly.

## Why we built it

General property portals bury plots under thousands of flats. Brokers charge 5–10%. Investors charge 2–5%. Fake listings are everywhere, and buyers have no easy way to verify what's real. We thought land deserved better.

## What KhaliPlot does

- **Browse free.** Every listing, filter and map is open to everyone.
- **Pay ₹499 to talk.** Reveal a verified seller's WhatsApp when you're ready.
- **₹0 commission on the sale.** The deal is directly between you and the seller.
- **Verified listings** with RERA and land-record trust badges.
- **Smart tools** — AI price suggestions and a built-in Indian unit converter.

## Our mission

Democratise land access, remove the commission middlemen, and build trust through transparency — for rural farmers and urban buyers alike.

## Join us

Whether you're buying your first plot or selling family land, KhaliPlot is built to make it fair. **Browse plots**, or **list yours free** in about five minutes.

This is just the beginning. Welcome aboard.`,
    createdAt: "2026-07-05T09:00:00Z",
  },
];

export function findSeedArticle(slug: string): NewsArticle | undefined {
  return seedArticles.find((a) => a.slug === slug);
}
