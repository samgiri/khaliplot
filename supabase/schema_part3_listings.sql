-- Part 3: seller-facing listings engine — post-a-plot, ownership/documents
-- trust section, photos, and the free-tier active-listing quota.
--
-- Run this in Supabase SQL Editor BEFORE merging the Part 3 PR. Purely
-- additive: no existing column, policy or table is dropped or renamed, so
-- the admin panel, seed listings and existing RLS keep working unchanged.
-- Safe to re-run (IF NOT EXISTS / guarded constraint blocks throughout).
--
-- NOTE ON STATUS: the table already uses status 'pending' | 'live' | 'sold' |
-- 'rejected' (default 'pending', RLS public-read on 'live'). Rather than
-- introducing a parallel 'active' vocabulary that would fight the existing
-- admin panel and RLS policy, this migration keeps 'live' as the
-- publicly-visible state — seller-submitted plots publish directly with
-- status = 'live' (no admin moderation step, matching the brief's "Publish
-- plot -> appears in /search" flow) — and just adds 'draft' and 'removed'
-- (seller soft-delete) to the allowed set.

-- ---------------------------------------------------------------------------
-- New columns for the post-a-plot form.
-- ---------------------------------------------------------------------------
alter table listings add column if not exists maps_link text;
alter table listings add column if not exists area_unit text not null default 'sqft';
alter table listings add column if not exists area_value numeric;
alter table listings add column if not exists price_per_unit numeric;
alter table listings add column if not exists ownership_type text;
alter table listings add column if not exists transaction_type text;
alter table listings add column if not exists na_status text;
alter table listings add column if not exists documents jsonb not null default '{}'::jsonb;
alter table listings add column if not exists corner_plot boolean;
alter table listings add column if not exists boundary_wall boolean;
alter table listings add column if not exists gated_layout boolean;
alter table listings add column if not exists possession text;
alter table listings add column if not exists photo_urls text[] not null default '{}';

-- Backfill area_value for existing seed/admin rows so it's never null for a
-- row that already has an area_sqft.
update listings set area_value = area_sqft where area_value is null;

-- ---------------------------------------------------------------------------
-- Check constraints (guarded so re-running this file doesn't error).
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'listings_area_unit_check') then
    alter table listings
      add constraint listings_area_unit_check
      check (area_unit in ('sqft', 'sqm', 'sqyd', 'guntha', 'acre', 'hectare'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'listings_ownership_type_check') then
    alter table listings
      add constraint listings_ownership_type_check
      check (ownership_type is null or ownership_type in ('Freehold', 'Leasehold', 'Power of Attorney'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'listings_transaction_type_check') then
    alter table listings
      add constraint listings_transaction_type_check
      check (transaction_type is null or transaction_type in ('New', 'Resale'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'listings_na_status_check') then
    alter table listings
      add constraint listings_na_status_check
      check (na_status is null or na_status in ('Yes', 'No', 'Don''t know'));
  end if;
end $$;

-- Widen the status constraint to add 'draft' and 'removed' (seller soft-
-- delete) alongside the existing admin-panel values.
alter table listings drop constraint if exists listings_status_check;
alter table listings
  add constraint listings_status_check
  check (status in ('pending', 'live', 'sold', 'rejected', 'draft', 'removed'));

-- ---------------------------------------------------------------------------
-- seller_id / RLS: already shipped in schema_phase1_auth.sql —
--   - listings.seller_id uuid references profiles(id)
--   - "Sellers can view own listings regardless of status" (select, own rows)
--   - "Sellers can insert own listings" (insert, own rows)
--   - "Sellers can update own listings" (update, own rows — used for both
--     edits and the soft-delete-to-'removed' / mark-sold status changes)
--   - "Public can view live listings" (select, status = 'live')
-- No RLS changes needed here; the new columns are covered by those same
-- row-level policies automatically.
-- ---------------------------------------------------------------------------

create index if not exists listings_seller_id_idx on listings (seller_id);

-- ---------------------------------------------------------------------------
-- Storage: listing photos.
--
-- MANUAL STEP FIRST (SQL can't create a bucket): in Supabase Studio go to
-- Storage -> Create bucket -> name it exactly "listing-photos" -> toggle
-- "Public bucket" ON -> Save. THEN run the policies below.
-- ---------------------------------------------------------------------------
drop policy if exists "Public read listing photos" on storage.objects;
create policy "Public read listing photos"
on storage.objects for select
using (bucket_id = 'listing-photos');

drop policy if exists "Users upload to their own listing-photos folder" on storage.objects;
create policy "Users upload to their own listing-photos folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'listing-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users update their own listing-photos" on storage.objects;
create policy "Users update their own listing-photos"
on storage.objects for update
to authenticated
using (
  bucket_id = 'listing-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users delete their own listing-photos" on storage.objects;
create policy "Users delete their own listing-photos"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'listing-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
