-- Part 1 public site: adapt `inquiries` (created in schema_phase1_auth.sql)
-- to also hold anonymous /contact page submissions, alongside the buyer <->
-- seller inquiries it already stores. Run this in Supabase SQL Editor AFTER
-- schema_phase1_auth.sql.
--
-- Rationale: buyer_id/seller_id/plot_id/channel are NOT NULL + FK'd to a
-- signed-in buyer and a specific listing, which a public contact-form
-- visitor doesn't have. Rather than a new table, we relax those columns and
-- add the fields the contact form collects, tagging rows with `source` so
-- the two flows stay distinguishable in the same table.

alter table inquiries
  alter column buyer_id drop not null,
  alter column seller_id drop not null,
  alter column plot_id drop not null;

alter table inquiries
  add column source text not null default 'buyer_seller',
  add column name text,
  add column phone text,
  add column email text,
  add column inquiry_type text
    check (inquiry_type in ('buying', 'selling', 'listing', 'pricing', 'partnership', 'other'));

-- No new RLS policy: contact-form inserts go through the server-side
-- /api/contact route using the service role key (bypasses RLS), never a
-- direct client insert. The existing buyer/seller policies are unaffected.
