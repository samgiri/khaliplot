-- Part 6: partner onboarding — Partner Type + package assignment.
--
-- Lets the admin dashboard tag a user's Partner Type (Influencer, Dealer,
-- Consultant, Brand Ambassador, Other) and assign them a package. Packages
-- are logged as rows in the existing `subscriptions` table (tier purchase
-- history) tagged with partner_type/notes/is_promotional, so admin-assigned
-- FREE packages and future Razorpay (Part 5) paid packages share one ledger
-- ("Packages" tab tracks both).
--
-- Run this in Supabase SQL Editor AFTER schema_phase1_auth.sql. Safe to re-run.

alter table profiles add column if not exists partner_type text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_partner_type_check'
  ) then
    alter table profiles
      add constraint profiles_partner_type_check
      check (partner_type is null or partner_type in ('influencer', 'dealer', 'consultant', 'brand_ambassador', 'other'));
  end if;
end $$;

alter table subscriptions add column if not exists partner_type text;
alter table subscriptions add column if not exists notes text not null default '';
alter table subscriptions add column if not exists is_promotional boolean not null default false;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'subscriptions_partner_type_check'
  ) then
    alter table subscriptions
      add constraint subscriptions_partner_type_check
      check (partner_type is null or partner_type in ('influencer', 'dealer', 'consultant', 'brand_ambassador', 'other'));
  end if;
end $$;

create index if not exists subscriptions_is_promotional_idx on subscriptions (is_promotional);

-- Inserts happen server-side from the admin "Assign Package" flow
-- (service role, app/api/admin/packages/route.ts) — same policy as the base
-- subscriptions table (no client-facing insert policy).
