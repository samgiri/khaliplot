-- Part 2: account/profile completion fields (role, state, city, language,
-- preferred contact method) used by /welcome, /profile and /dashboard.
--
-- Run this in Supabase SQL Editor AFTER schema_phase1_auth.sql, BEFORE
-- merging the Part 2 PR. Written to be safe to re-run (IF NOT EXISTS guards).

alter table profiles add column if not exists state text;
alter table profiles add column if not exists city text;
alter table profiles add column if not exists preferred_language text;
alter table profiles add column if not exists preferred_contact_method text;

-- preferred_language / preferred_contact_method checks, added separately so
-- a re-run doesn't fail if the column already exists without them.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_preferred_language_check'
  ) then
    alter table profiles
      add constraint profiles_preferred_language_check
      check (preferred_language is null or preferred_language in ('en', 'hi'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_preferred_contact_method_check'
  ) then
    alter table profiles
      add constraint profiles_preferred_contact_method_check
      check (preferred_contact_method is null or preferred_contact_method in ('whatsapp', 'call', 'email'));
  end if;
end $$;

-- Widen the role constraint to the Part 2 role set (buyer/seller/broker/
-- builder). The admin panel uses its own cookie-based session (lib/admin-auth.ts),
-- not profiles.role, so 'admin' is dropped from the allowed values here; any
-- existing 'admin'-tagged row is defensively moved to 'buyer' first so the
-- new constraint can never fail to apply.
update profiles set role = 'buyer' where role = 'admin';

alter table profiles drop constraint if exists profiles_role_check;
alter table profiles
  add constraint profiles_role_check
  check (role in ('buyer', 'seller', 'broker', 'builder'));

-- RLS already restricts profiles to the owning user for select/update
-- (see schema_phase1_auth.sql: "Users can view own profile" /
-- "Users can update own profile", both `using (auth.uid() = id)`).
-- No changes needed there — the new columns are covered by the same rows.
