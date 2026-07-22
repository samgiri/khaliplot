-- Part 8: switch profiles.preferred_language from short codes ('en'/'hi', set
-- by schema_part2_profiles.sql) to full words ('english'/'hindi') to match
-- the ProfileForm option values. No Marathi option.
--
-- Converts any already-saved 'en'/'hi' rows to the new values first so
-- existing users' saved preference doesn't silently stop matching any
-- option in the form.
--
-- Run this in Supabase SQL Editor AFTER schema_part2_profiles.sql. Safe to re-run.

update profiles set preferred_language = 'english' where preferred_language = 'en';
update profiles set preferred_language = 'hindi' where preferred_language = 'hi';

alter table profiles drop constraint if exists profiles_preferred_language_check;
alter table profiles
  add constraint profiles_preferred_language_check
  check (preferred_language is null or preferred_language in ('english', 'hindi'));
