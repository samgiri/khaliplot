-- Part 2 (pricing page enhancements): "Founding 100" badge — the first 100
-- members get 50% off everything (see the ribbon on /pricing). This column
-- is set server-side once a purchase/signup qualifies; the pricing page only
-- ever reads a count of it.
--
-- Run this in Supabase SQL Editor AFTER schema_phase1_auth.sql. Safe to re-run.

alter table profiles add column if not exists founding_100_badge boolean not null default false;

-- Fast COUNT(founding_100_badge = true) for the pricing page's spots-left banner.
create index if not exists profiles_founding_100_badge_idx
on profiles (founding_100_badge)
where founding_100_badge;
