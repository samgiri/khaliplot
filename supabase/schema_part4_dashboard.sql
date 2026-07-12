-- Part 4: buyer dashboard support — tracks which plots a signed-in user has
-- viewed, so the dashboard's "plots viewed" stat is real instead of mocked.
--
-- Run this in Supabase SQL Editor BEFORE merging the Part 4 PR. Everything
-- else the buyer dashboard needs (saved_plots, inquiries, contact_reveals,
-- profiles.subscription_tier) already exists with adequate RLS from
-- schema_phase1_auth.sql — no changes needed there. Safe to re-run.

create table if not exists listing_views (
  id uuid primary key default gen_random_uuid(),
  viewer_id uuid not null references profiles (id) on delete cascade,
  plot_id text not null references listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (viewer_id, plot_id)
);

create index if not exists listing_views_viewer_id_idx on listing_views (viewer_id);

alter table listing_views enable row level security;

drop policy if exists "Viewers manage their own listing views" on listing_views;
create policy "Viewers manage their own listing views"
on listing_views for all
using (auth.uid() = viewer_id)
with check (auth.uid() = viewer_id);

-- One row per (viewer, plot) — revisiting a plot doesn't create duplicates,
-- so "plots viewed" on the dashboard means distinct plots, not page loads.
