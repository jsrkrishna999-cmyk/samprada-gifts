"use client";

/**
 * Client-side product/category cache, backed by Supabase. Fetched once on
 * mount (the catalog is small — ~30 products) and cached in memory so
 * interactive client components (cart, wishlist, nav, filters) can look
 * products up synchronously by slug, mirroring the old static-import API.
 * Server Components fetch fresh data per-request via lib/supabase/queries.ts
 * instead of this — this context is for the client-only pieces.
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Category, Product } from "@/lib/types";
import { rowToCategory, rowsToProducts } from "@/lib/supabase/mappers";
import { createClient } from "@/lib/supabase/client";

interface CatalogContextValue {
  products: Product[];
  categories: Category[];
  loading: boolean;
  getProductBySlug: (slug: string) => Product | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
  getProductsByCategory: (categorySlug: string) => Product[];
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [{ data: categoryRows }, { data: productRows }, { data: reviewRows }] = await Promise.all([
        supabase.from("categories").select("*").order("created_at"),
        supabase.from("products").select("*").order("created_at"),
        supabase.from("reviews").select("*").order("created_at"),
      ]);
      if (cancelled) return;
      setCategories((categoryRows ?? []).map(rowToCategory));
      setProducts(rowsToProducts(productRows ?? [], reviewRows ?? []));
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const value = useMemo<CatalogContextValue>(
    () => ({
      products,
      categories,
      loading,
      getProductBySlug: (slug) => products.find((p) => p.slug === slug),
      getCategoryBySlug: (slug) => categories.find((c) => c.slug === slug),
      getProductsByCategory: (categorySlug) => products.filter((p) => p.categorySlug === categorySlug),
    }),
    [products, categories, loading]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
