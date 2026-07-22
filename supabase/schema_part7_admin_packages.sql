-- Part 7: admin package catalog — lets the admin "Assign Package" flow log a
-- specific product (Free, Reveal Pack, Plus 1M/100D/Yearly, Booster) instead
-- of just a bare tier, and tracks a Reveal Pack as its own ledger entry.
--
-- `subscriptions.tier` keeps driving real access (profiles.subscription_tier
-- mirrors it — see lib/listings-quota.ts / lib/dashboard-service.ts, which
-- only ever check "free" vs not). Reveal Pack is a top-up, not a plan, so it
-- gets its own tier value that is NEVER mirrored onto profiles.subscription_tier
-- (see app/api/admin/packages/route.ts) — this migration intentionally does
-- NOT touch the profiles_subscription_tier check, only subscriptions.tier.
--
-- Run this in Supabase SQL Editor AFTER schema_part6_partner_packages.sql.
-- Safe to re-run.

alter table subscriptions drop constraint if exists subscriptions_tier_check;
alter table subscriptions
  add constraint subscriptions_tier_check
  check (tier in ('free', 'featured', 'boost', 'reveal_pack'));

-- package_key is the precise catalog item chosen in the admin UI (e.g.
-- 'plus_100d' vs 'plus_yearly', both tier='featured') — display-only, never
-- read by quota/access logic. Nullable so historic Part 6 rows (assigned
-- before this catalog existed) keep working; the UI falls back to a
-- title-cased tier label when it's null.
alter table subscriptions add column if not exists package_key text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'subscriptions_package_key_check'
  ) then
    alter table subscriptions
      add constraint subscriptions_package_key_check
      check (package_key is null or package_key in (
        'free', 'reveal_pack', 'plus_1m', 'plus_100d', 'plus_yearly', 'booster'
      ));
  end if;
end $$;

create index if not exists subscriptions_package_key_idx on subscriptions (package_key);
