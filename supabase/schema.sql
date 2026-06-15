-- KhaliPlot listings table
-- Run this in Supabase SQL Editor (Project > SQL Editor > New query)

create table listings (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  plot_type text not null check (plot_type in ('Residential', 'Agricultural', 'Commercial', 'Farmhouse', 'Industrial')),
  city text not null,
  locality text not null,
  state text not null default 'Maharashtra',
  area_sqft numeric not null,
  price_lakh numeric not null,
  price_per_sqft numeric not null,
  facing text not null default 'East',
  road_width_ft numeric not null default 0,
  dimensions text not null default '',
  zone text not null default '',
  features text[] not null default '{}',
  description text not null default '',
  verified boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'live', 'sold', 'rejected')),
  seller_name text not null,
  seller_type text not null check (seller_type in ('Owner', 'Agent', 'Builder')),
  seller_phone text not null,
  lat numeric,
  lng numeric,
  images int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for common filters
create index listings_city_idx on listings (city);
create index listings_plot_type_idx on listings (plot_type);
create index listings_status_idx on listings (status);

-- Auto-update updated_at on row change
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger listings_set_updated_at
before update on listings
for each row
execute function set_updated_at();

-- Row Level Security
alter table listings enable row level security;

-- Public can read only "live" listings
create policy "Public can view live listings"
on listings for select
using (status = 'live');

-- Note: insert/update/delete will be done via the admin API route using the
-- service role key (server-side only, bypasses RLS), so no public write
-- policies are needed. This keeps the anon/public key read-only and safe
-- to use in the browser.
