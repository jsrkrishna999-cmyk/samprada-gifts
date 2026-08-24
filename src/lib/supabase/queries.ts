// Server-side data access for the storefront. Pages (Server Components)
// call these directly so product/category content is always read live from
// Supabase — edit a row in the Supabase dashboard and it shows up on the
// next request, no redeploy needed.

import type { Category, Product } from "@/lib/types";
import { rowToCategory, rowsToProducts } from "./mappers";
import { createClient } from "./server";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("created_at");
  return (data ?? []).map(rowToCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
  return data ? rowToCategory(data) : undefined;
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const [{ data: productRows }, { data: reviewRows }] = await Promise.all([
    supabase.from("products").select("*").order("created_at"),
    supabase.from("reviews").select("*").order("created_at"),
  ]);
  return rowsToProducts(productRows ?? [], reviewRows ?? []);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = await createClient();
  const [{ data: row }, { data: reviewRows }] = await Promise.all([
    supabase.from("products").select("*").eq("slug", slug).maybeSingle(),
    supabase.from("reviews").select("*").eq("product_slug", slug).order("created_at"),
  ]);
  if (!row) return undefined;
  return rowsToProducts([row], reviewRows ?? [])[0];
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category_slug", categorySlug)
    .order("created_at");
  return rowsToProducts(data ?? [], []);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category_slug", product.categorySlug)
    .neq("slug", product.slug)
    .limit(limit);
  return rowsToProducts(data ?? [], []);
}

export async function getFrequentlyBoughtWith(product: Product, limit = 2): Promise<Product[]> {
  const supabase = await createClient();
  // Only purchasable products can be bundled.
  const { data } = await supabase
    .from("products")
    .select("*")
    .neq("slug", product.slug)
    .eq("status", "active")
    .limit(limit);
  return rowsToProducts(data ?? [], []);
}

export async function getBestsellers(limit = 8): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .contains("badges", ["bestseller"])
    .limit(limit);
  return rowsToProducts(data ?? [], []);
}

export async function getTrending(limit = 8): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .overlaps("badges", ["trending", "new"])
    .limit(limit);
  return rowsToProducts(data ?? [], []);
}
