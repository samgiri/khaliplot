-- Phase 1: buyer/seller accounts (Supabase Auth, email + magic link) and the
-- core tables the buyer dashboard and contact-reveal flow are built on.
--
-- Run this in Supabase SQL Editor AFTER schema.sql and schema_fix_phone_leak.sql.
-- Auth itself (email/magic-link) is a dashboard toggle in
-- Authentication > Providers — no SQL needed for that part.

-- ---------------------------------------------------------------------------
-- profiles: one row per auth.users row, holding the app-specific fields the
-- brief's "users" table describes (role, subscription tier, etc). Supabase
-- Auth already owns id/email, so profiles just extends it 1:1.
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  phone text,
  name text,
  role text not null default 'buyer' check (role in ('buyer', 'seller', 'broker', 'admin')),
  location text,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'featured', 'boost')),
  sub_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on profiles
for each row
execute function set_updated_at(); -- reused from schema.sql

-- Auto-create a profile row whenever someone signs up via Supabase Auth.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function handle_new_user();

alter table profiles enable row level security;

create policy "Users can view own profile"
on profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id);

-- No public insert policy: rows are created by the trigger above (security
-- definer, bypasses RLS), never directly by a client.

-- ---------------------------------------------------------------------------
-- Link listings to a seller account. Existing rows predate real accounts, so
-- this is nullable — backfilling/claiming existing listings is a separate,
-- later concern.
-- ---------------------------------------------------------------------------
alter table listings add column seller_id uuid references profiles (id);
create index listings_seller_id_idx on listings (seller_id);

create policy "Sellers can view own listings regardless of status"
on listings for select
using (auth.uid() = seller_id);

create policy "Sellers can insert own listings"
on listings for insert
with check (auth.uid() = seller_id);

create policy "Sellers can update own listings"
on listings for update
using (auth.uid() = seller_id);

-- ---------------------------------------------------------------------------
-- contacts: reveal channels for a seller (phone/email/whatsapp/telegram/
-- website), kept separate from listings per the brief's design.
-- ---------------------------------------------------------------------------
create table contacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles (id) on delete cascade,
  contact_type text not null check (contact_type in ('phone', 'email', 'whatsapp', 'telegram', 'website')),
  contact_value text not null,
  created_at timestamptz not null default now()
);

create index contacts_owner_id_idx on contacts (owner_id);
alter table contacts enable row level security;

create policy "Owners manage their own contacts"
on contacts for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

-- No policy lets a buyer select another user's contacts directly — the
-- reveal flow (later phase) reads them server-side via the service role
-- after quota checks pass.

-- ---------------------------------------------------------------------------
-- saved_plots: buyer wishlist
-- ---------------------------------------------------------------------------
create table saved_plots (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references profiles (id) on delete cascade,
  plot_id text not null references listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (buyer_id, plot_id)
);

create index saved_plots_buyer_id_idx on saved_plots (buyer_id);
alter table saved_plots enable row level security;

create policy "Buyers manage their own saved plots"
on saved_plots for all
using (auth.uid() = buyer_id)
with check (auth.uid() = buyer_id);

-- ---------------------------------------------------------------------------
-- inquiries: buyer -> seller contact attempts on a plot
-- ---------------------------------------------------------------------------
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references profiles (id) on delete cascade,
  seller_id uuid not null references profiles (id) on delete cascade,
  plot_id text not null references listings (id) on delete cascade,
  channel text not null check (channel in ('call', 'email', 'whatsapp', 'telegram', 'website', 'message')),
  message text not null default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create index inquiries_buyer_id_idx on inquiries (buyer_id);
create index inquiries_seller_id_idx on inquiries (seller_id);
alter table inquiries enable row level security;

create policy "Buyers manage their own inquiries"
on inquiries for all
using (auth.uid() = buyer_id)
with check (auth.uid() = buyer_id);

create policy "Sellers view inquiries addressed to them"
on inquiries for select
using (auth.uid() = seller_id);

create policy "Sellers update status of inquiries addressed to them"
on inquiries for update
using (auth.uid() = seller_id)
with check (auth.uid() = seller_id);

-- ---------------------------------------------------------------------------
-- contact_reveals: log of every contact a buyer has unlocked (also doubles
-- as the source of truth for monthly free-tier quota checks)
-- ---------------------------------------------------------------------------
create table contact_reveals (
  id uuid primary key default gen_random_uuid(),
  viewer_id uuid not null references profiles (id) on delete cascade,
  target_owner_id uuid not null references profiles (id) on delete cascade,
  contact_id uuid not null references contacts (id) on delete cascade,
  plot_id text not null references listings (id) on delete cascade,
  tier_used text not null check (tier_used in ('free', 'featured', 'boost')),
  created_at timestamptz not null default now()
);

create index contact_reveals_viewer_id_idx on contact_reveals (viewer_id);
create index contact_reveals_viewer_created_idx on contact_reveals (viewer_id, created_at);
alter table contact_reveals enable row level security;

create policy "Viewers see their own reveal history"
on contact_reveals for select
using (auth.uid() = viewer_id);

-- Inserts happen only through the server-side reveal endpoint (service role
-- key), which enforces quota — never a direct client insert.

-- ---------------------------------------------------------------------------
-- subscriptions: tier purchase history + current status
-- ---------------------------------------------------------------------------
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  tier text not null check (tier in ('free', 'featured', 'boost')),
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  amount numeric not null default 0,
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  created_at timestamptz not null default now()
);

create index subscriptions_user_id_idx on subscriptions (user_id);
alter table subscriptions enable row level security;

create policy "Users view their own subscription history"
on subscriptions for select
using (auth.uid() = user_id);

-- Inserts/updates happen server-side once payment integration lands
-- (out of scope for now, per the build brief).
