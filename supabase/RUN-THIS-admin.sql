-- ================================================================
-- Samprada Gifts — admin dashboard + real orders
-- Paste into: Supabase dashboard -> SQL Editor -> New query -> Run
--
-- AFTER running this, make yourself an admin (see bottom of file).
-- ================================================================

-- Migration 003 — admin access, real orders, and product image storage.
--
-- Run AFTER 002_real_catalog.sql. Idempotent: safe to re-run.
--
-- Security model: the storefront uses the publishable (anon) key in the
-- browser, so every write is gated by RLS rather than by keeping a key secret.
-- Admin identity lives in the `admins` table, checked by is_admin().

-- ---------------------------------------------------------------------------
-- Admins
-- ---------------------------------------------------------------------------

create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table admins enable row level security;

-- SECURITY DEFINER so the function can read `admins` regardless of the
-- caller's own RLS. Without this, policies that call is_admin() would
-- recurse into admins' own policy and always deny.
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

drop policy if exists "Admins read admin list" on admins;
create policy "Admins read admin list" on admins
  for select using (is_admin());

-- ---------------------------------------------------------------------------
-- Admin write access to the catalog
-- ---------------------------------------------------------------------------

drop policy if exists "Admins write products" on products;
create policy "Admins write products" on products
  for all using (is_admin()) with check (is_admin());

drop policy if exists "Admins write categories" on categories;
create policy "Admins write categories" on categories
  for all using (is_admin()) with check (is_admin());

drop policy if exists "Admins write reviews" on reviews;
create policy "Admins write reviews" on reviews
  for all using (is_admin()) with check (is_admin());

-- product_costs is admin-only for both read and write.
drop policy if exists "Admins manage costs" on product_costs;
create policy "Admins manage costs" on product_costs
  for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid references auth.users(id) on delete set null,
  -- Kept denormalised so a guest order, or one whose account is later
  -- deleted, still has contact details attached.
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  status text not null default 'processing'
    check (status in ('processing', 'shipped', 'delivered', 'cancelled')),
  payment_method text not null,
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  subtotal integer not null,
  discount integer not null default 0,
  delivery_fee integer not null default 0,
  total integer not null,
  coupon_code text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_slug text not null,
  -- Name and price are snapshotted: if the catalog changes later, the order
  -- must still show what the customer actually bought and paid.
  product_name text not null,
  unit_price integer not null,
  quantity integer not null check (quantity > 0),
  gift_wrap boolean not null default false,
  line_total integer not null
);

create index if not exists orders_user_idx on orders (user_id);
create index if not exists orders_created_idx on orders (created_at desc);
create index if not exists order_items_order_idx on order_items (order_id);

alter table orders enable row level security;
alter table order_items enable row level security;

-- Customers may read and create their own orders; admins see everything.
drop policy if exists "Users read own orders" on orders;
create policy "Users read own orders" on orders
  for select using (auth.uid() = user_id or is_admin());

drop policy if exists "Users create own orders" on orders;
create policy "Users create own orders" on orders
  for insert with check (auth.uid() = user_id);

drop policy if exists "Admins update orders" on orders;
create policy "Admins update orders" on orders
  for update using (is_admin()) with check (is_admin());

drop policy if exists "Admins delete orders" on orders;
create policy "Admins delete orders" on orders
  for delete using (is_admin());

drop policy if exists "Read own order items" on order_items;
create policy "Read own order items" on order_items
  for select using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or is_admin())
    )
  );

drop policy if exists "Create own order items" on order_items;
create policy "Create own order items" on order_items
  for insert with check (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "Admins write order items" on order_items;
create policy "Admins write order items" on order_items
  for all using (is_admin()) with check (is_admin());

-- Human-friendly order numbers: SG-000001, SG-000002, ...
create sequence if not exists order_number_seq start 100001;

create or replace function set_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number := 'SG-' || nextval('order_number_seq');
  end if;
  return new;
end;
$$;

drop trigger if exists orders_set_number on orders;
create trigger orders_set_number
  before insert on orders
  for each row execute function set_order_number();

create or replace function touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists orders_touch_updated on orders;
create trigger orders_touch_updated
  before update on orders
  for each row execute function touch_updated_at();

-- ---------------------------------------------------------------------------
-- Product image storage
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and is_admin());

drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images" on storage.objects
  for update using (bucket_id = 'product-images' and is_admin());

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images" on storage.objects
  for delete using (bucket_id = 'product-images' and is_admin());

-- ---------------------------------------------------------------------------
-- Make yourself an admin
-- ---------------------------------------------------------------------------
-- Sign up on the site first, then run this with your own email:
--
--   insert into admins (user_id, email)
--   select id, email from auth.users where email = 'you@example.com'
--   on conflict (user_id) do nothing;
