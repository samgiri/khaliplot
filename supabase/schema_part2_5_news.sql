-- Part 2.5: news_articles table ("Why invest in X" + infrastructure news) and
-- the 4 launch seed articles.
--
-- Run this in Supabase SQL Editor BEFORE merging the Part 2.5 PR. Safe to
-- re-run: table/index/policy creation is guarded, and the seed insert is
-- keyed on the unique slug so it won't duplicate rows on a second run.

create table if not exists news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  city_tag text,
  excerpt text,
  content text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists news_articles_published_created_idx
  on news_articles (published, created_at desc);

alter table news_articles enable row level security;

drop policy if exists "Public can view published articles" on news_articles;
create policy "Public can view published articles"
on news_articles for select
using (published = true);

-- No insert/update/delete policies: articles are managed via the Supabase
-- Table Editor (service role) for now — no public/CMS write path in this part.

-- ---------------------------------------------------------------------------
-- Seed content — the 4 approved launch articles.
-- ---------------------------------------------------------------------------
insert into news_articles (slug, title, city_tag, excerpt, content, published)
values
(
  'why-invest-navi-mumbai-plots-2026',
  $t$Why Navi Mumbai Plots Are India's Hottest Land Story Right Now$t$,
  'Navi Mumbai',
  $ex$The new international airport is open, the Atal Setu is running, and plot prices around Panvel and Ulwe have nearly doubled since 2021. Here's what's driving it.$ex$,
  $md$Navi Mumbai International Airport began commercial operations in December 2025 and moved to round-the-clock flights in early 2026. For land buyers, this is the single biggest infrastructure event in the Mumbai region in decades.

The effect on plots has been dramatic. Property analysts report that residential plot values in the Panvel belt have risen roughly 90%+ over the last four years, and areas like Ulwe have seen prices approximately double since 2021. The Atal Setu sea bridge now connects South Mumbai to the airport region in under 40 minutes, pulling the whole Panvel–Ulwe–Kharghar belt closer to the city.

What's next? The upcoming Metro Line 8 ("Gold Line") will link the new airport directly to Mumbai's existing airport, and CIDCO's 667-acre Aerocity plan is being finalized. Analysts project 8–12% annual appreciation in the airport influence zone over the next five to seven years — driven now by real jobs and real flights, not speculation.

For plot buyers, the lesson from global airport cities is that the steepest growth often comes 2–5 years AFTER the airport opens, as hotels, logistics and offices fill in. The entry window in nodes like Dronagiri, New Panvel and the NAINA area is still open.

*Land prices vary by location, title and NA status. Always verify documents before purchase. This is general information, not investment advice.*$md$,
  true
),
(
  'neemrana-delhi-mumbai-expressway-plots',
  $t$Neemrana: The Quiet Winner of the Delhi–Mumbai Expressway$t$,
  'Neemrana',
  $ex$90 minutes from Delhi, an industrial hub with Japanese manufacturing zones, and now on India's longest expressway. Neemrana's land story is just beginning.$ex$,
  $md$The Delhi–Mumbai Expressway — India's longest at 1,350 km — is transforming the towns along its route, and few are better placed than Neemrana in Rajasthan.

Sitting about 90 minutes from Delhi on the operational Delhi–Rajasthan stretch, Neemrana was already known for its industrial zones, including dedicated Japanese manufacturing clusters. The expressway adds the missing piece: high-speed connectivity to both the national capital and, eventually, Mumbai's port belt.

The numbers along the corridor tell the story. Reports on the Neemrana–Behror belt indicate land appreciation of roughly 35–45% over recent years, with industrial demand pulling residential development along with it. Established developers have launched plotted projects in the area, and nearby corridor towns like Alwar and Dausa are seeing affordable plotted development aimed at first-time buyers.

Investment wisdom from the corridor: plots within 5–10 km of expressway interchanges have historically appreciated fastest. Neemrana combines that interchange advantage with an existing industrial economy — a rare double.

*Land prices vary by location, title and land-use classification. Verify RERA and zoning status before purchase. This is general information, not investment advice.*$md$,
  true
),
(
  'dholera-smart-city-plot-investment',
  $t$Dholera SIR: Buying Land in India's First Greenfield Smart City$t$,
  'Dholera',
  $ex$A planned smart city on the Delhi–Mumbai Industrial Corridor, an expressway cutting travel to Ahmedabad to 45 minutes, and an airport on the way.$ex$,
  $md$Dholera Special Investment Region (SIR), about 100 km from Ahmedabad, is India's most ambitious attempt at building a smart city from scratch — planned as part of the Delhi–Mumbai Industrial Corridor with plotted land at its core.

Two infrastructure pieces make Dholera interesting for land buyers right now. First, the Ahmedabad–Dholera Expressway, which is set to cut travel time to around 45 minutes, turning a remote region into a commutable one. Second, the broader DMIC freight and industrial network, which is designed to bring manufacturing — and with it, jobs and housing demand — to the region.

Because Dholera is master-planned, plots come with defined sectors, land-use zoning and phased infrastructure delivery. Investors tracking the region often focus on sectors closest to the expressway alignment and activation areas, where roads and utilities arrive first.

Dholera is a long-horizon play: prices are still at an early stage compared to established metros, which is exactly why disciplined buyers with a 7–10 year view find it attractive. Due diligence on the exact sector, land classification and possession timelines matters more here than anywhere else.

*Smart-city projects evolve in phases and timelines can shift. Verify all documents, sector plans and land-use status before purchase. Not investment advice.*$md$,
  true
),
(
  'plots-vs-flats-why-land-wins',
  $t$Plots vs Flats: Why More Indian Buyers Are Choosing Land in 2026$t$,
  'India',
  $ex$No maintenance, no depreciation, full ownership. The case for buying a plot instead of an apartment — and what to check before you do.$ex$,
  $md$Across India's growth corridors, a quiet shift is underway: more buyers are choosing vacant plots over ready apartments. The logic is simple and increasingly hard to ignore.

A building starts ageing the day it's completed — it needs maintenance, repairs and society fees, and its structure depreciates even as the land under it appreciates. A plot is the opposite: nothing to maintain, nothing to depreciate. You own the part of the asset that actually gains value as an area develops.

Plots also keep your options open. Build a home when you're ready. Lease farmland for income while you hold. Or simply hold and sell into a rising market. An apartment locks you into one use; land adapts to your life.

The catch? Land requires more homework than a flat. Before buying any plot, verify: clear title, NA (non-agricultural) status where you plan to build, RERA registration for plotted developments, access road width, and the 7/12 extract or equivalent land record. The buyers who win with land are the ones who verify first and buy second.

That verification gap is exactly why KhaliPlot exists — a marketplace built only for plots, with direct owner contact and no broker noise.

*Always verify legal documents independently before purchase. Not investment advice.*$md$,
  true
)
on conflict (slug) do nothing;
