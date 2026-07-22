-- Part 8: add Marathi as a third preferred_language option (alongside
-- English/Hindi) on the /welcome and /profile forms.
--
-- Run this in Supabase SQL Editor AFTER schema_part2_profiles.sql. Safe to re-run.

alter table profiles drop constraint if exists profiles_preferred_language_check;
alter table profiles
  add constraint profiles_preferred_language_check
  check (preferred_language is null or preferred_language in ('en', 'hi', 'mr'));
