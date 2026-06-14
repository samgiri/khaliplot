# KhaliPlot.in — India's Plot Marketplace

A Next.js + TypeScript + Tailwind CSS site for KhaliPlot, India's marketplace for vacant
plots and land. Built with mock data, ready to deploy and iterate on.

## What's included

- **Home** (`/`) — hero with search card, plot type categories, featured listings, why
  KhaliPlot, city expansion roadmap (Lonavla -> Pune -> Nashik), sell CTA
- **Search** (`/search`) — filterable, sortable plot listings with sidebar filters
  (city, plot type, budget, verified-only)
- **Listing detail** (`/listing/[id]`) — full plot details, key facts, features,
  seller contact card, similar listings
- **Seller dashboard** (`/seller`) — Overview, My Listings, Add Listing (form), Leads tabs

All listing data is in `lib/data.ts` -- replace with real data or a database later.

Brand palette and the dashed-boundary "plot map" signature motif are defined in
`app/globals.css` (CSS variables + utility classes `.plot-divider`, `.plot-border`,
`.coord-label`, etc).

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploying to Vercel (recommended)

1. **Push this project to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial KhaliPlot site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/khaliplot.git
   git push -u origin main
   ```

2. **Import into Vercel**
   - Go to https://vercel.com/new
   - Sign in with GitHub, select the `khaliplot` repo
   - Framework preset: Next.js (auto-detected) -- no config changes needed
   - Click **Deploy**

   Vercel will give you a live URL like `khaliplot.vercel.app` within ~2 minutes.

3. **Connect your domain (khaliplot.in)**
   - In the Vercel project, go to **Settings -> Domains**
   - Add `khaliplot.in` and `www.khaliplot.in`
   - Vercel will show you DNS records to add at your domain registrar (GoDaddy/Hostinger/etc):
     - An `A` record pointing `@` to Vercel's IP, or
     - A `CNAME` record pointing `www` to `cname.vercel-dns.com`
   - DNS changes can take a few hours to propagate

## Deploying to Netlify (alternative)

1. Push to GitHub as above
2. Go to https://app.netlify.com/start, connect the repo
3. Build command: `npm run build` -- Netlify auto-detects Next.js and configures the rest
4. Add your custom domain under **Site settings -> Domain management**

## Next steps / things to upgrade later

- Replace mock listings in `lib/data.ts` with real data from a database (Supabase/Postgres
  pairs well with Vercel)
- Wire up the "Add Listing" form and "Call seller / WhatsApp" buttons to real
  backend endpoints
- Add image upload + real photos (currently placeholders)
- Add authentication for the seller dashboard
- Replace the location placeholder on listing pages with an embedded map
