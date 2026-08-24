-- Migration 002 — support the real Samprada catalog alongside the demo products.
--
-- Run this AFTER schema.sql. It is idempotent: safe to re-run.
--
-- Why each change:
--  * price/mrp become nullable — real products are loaded before their retail
--    prices are decided, so "no price yet" must be representable.
--  * status distinguishes a sellable product from one that is only browsable.
--  * source separates the invented demo catalog from real inventory, so the
--    demo rows can be deleted in one statement later without touching real data.
--  * product_costs holds supplier/cost prices. It is deliberately a SEPARATE
--    table with RLS on and NO public read policy — cost prices must never be
--    served to the browser alongside the public product feed.

alter table products alter column price drop not null;
alter table products alter column mrp drop not null;
alter table products alter column budget_tier drop not null;

alter table products
  add column if not exists status text not null default 'active';

alter table products
  add column if not exists source text not null default 'demo';

-- 'active'           — normal, purchasable
-- 'price_on_request' — visible, photo shown, no price, no add-to-cart
-- 'coming_soon'      — visible, photo shown, not yet available
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'products_status_check'
  ) then
    alter table products add constraint products_status_check
      check (status in ('active', 'price_on_request', 'coming_soon'));
  end if;
end $$;

-- A purchasable product must actually have a price.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'products_active_needs_price'
  ) then
    alter table products add constraint products_active_needs_price
      check (status <> 'active' or price is not null);
  end if;
end $$;

create index if not exists products_status_idx on products (status);
create index if not exists products_source_idx on products (source);

-- Private cost reference. RLS enabled with no policies => no anon access at all.
create table if not exists product_costs (
  product_slug text primary key references products(slug) on delete cascade,
  product_code text not null,
  cost_price numeric(10, 2),
  supplier text,
  notes text,
  updated_at timestamptz not null default now()
);

alter table product_costs enable row level security;
