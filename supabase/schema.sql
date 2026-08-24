-- Samprada Gifts — core schema (Phase 1: products, categories, auth)
--
-- Run this once in Supabase Dashboard → SQL Editor → New query, before
-- running seed.sql. Safe to re-run (uses IF NOT EXISTS / drop-and-recreate
-- for policies).

-- ---------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------
create table if not exists categories (
  id text primary key,
  slug text unique not null,
  name text not null,
  description text not null,
  image_url text not null,
  product_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------
create table if not exists products (
  id text primary key,
  slug text unique not null,
  name text not null,
  tagline text not null,
  category_slug text not null references categories(slug) on delete restrict,
  price integer not null,
  mrp integer not null,
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  images text[] not null default '{}',
  badges text[] not null default '{}',
  min_qty integer not null default 1,
  description text not null,
  highlights text[] not null default '{}',
  specifications jsonb not null default '[]',
  packaging text[] not null default '{}',
  shipping text[] not null default '{}',
  budget_tier text not null,
  created_at timestamptz not null default now()
);

create index if not exists products_category_slug_idx on products(category_slug);
create index if not exists products_budget_tier_idx on products(budget_tier);

-- ---------------------------------------------------------------------
-- Reviews
-- ---------------------------------------------------------------------
create table if not exists reviews (
  id text primary key,
  product_slug text not null references products(slug) on delete cascade,
  author text not null,
  rating integer not null check (rating between 1 and 5),
  review_date text not null,
  title text not null,
  body text not null,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_slug_idx on reviews(product_slug);

-- ---------------------------------------------------------------------
-- Row Level Security — public can read, nothing else is allowed from the
-- client. Product/category management happens via the SQL editor or a
-- future admin panel using the service role key (which bypasses RLS).
-- ---------------------------------------------------------------------
alter table categories enable row level security;
alter table products enable row level security;
alter table reviews enable row level security;

drop policy if exists "Public read categories" on categories;
create policy "Public read categories" on categories
  for select using (true);

drop policy if exists "Public read products" on products;
create policy "Public read products" on products
  for select using (true);

drop policy if exists "Public read reviews" on reviews;
create policy "Public read reviews" on reviews
  for select using (true);
