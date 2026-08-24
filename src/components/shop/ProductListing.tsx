"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/context/catalog-context";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const budgetOptions: { value: Product["budgetTier"]; label: string }[] = [
  { value: "under-100", label: "Under ₹100" },
  { value: "100-300", label: "₹100 – ₹300" },
  { value: "300-600", label: "₹300 – ₹600" },
  { value: "600-plus", label: "₹600 & above" },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export function ProductListing({ initialCategory }: { initialCategory?: string }) {
  const searchParams = useSearchParams();
  const { products: allProducts, categories, loading } = useCatalog();
  const [category, setCategory] = useState<string | undefined>(initialCategory);
  const [budget, setBudget] = useState<Product["budgetTier"] | undefined>(
    (searchParams.get("budget") as Product["budgetTier"]) || undefined
  );
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = allProducts;
    if (category) list = list.filter((p) => p.categorySlug === category);
    if (budget) list = list.filter((p) => p.budgetTier === budget);

    // Unpriced products always sort last, whichever price direction is chosen.
    const byPrice = (dir: 1 | -1) => (a: Product, b: Product) => {
      if (a.price == null && b.price == null) return 0;
      if (a.price == null) return 1;
      if (b.price == null) return -1;
      return (a.price - b.price) * dir;
    };

    switch (sort) {
      case "price-asc":
        list = [...list].sort(byPrice(1));
        break;
      case "price-desc":
        list = [...list].sort(byPrice(-1));
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
    }
    return list;
  }, [allProducts, category, budget, sort]);

  const FiltersPanel = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-dark">
          Category
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={() => setCategory(undefined)}
            className={cn(
              "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
              !category ? "bg-maroon-600 text-ivory" : "text-brown-700/80 hover:bg-cream"
            )}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCategory(c.slug)}
              className={cn(
                "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                category === c.slug ? "bg-maroon-600 text-ivory" : "text-brown-700/80 hover:bg-cream"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-dark">
          Budget
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={() => setBudget(undefined)}
            className={cn(
              "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
              !budget ? "bg-maroon-600 text-ivory" : "text-brown-700/80 hover:bg-cream"
            )}
          >
            Any Budget
          </button>
          {budgetOptions.map((b) => (
            <button
              key={b.value}
              onClick={() => setBudget(b.value)}
              className={cn(
                "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                budget === b.value ? "bg-maroon-600 text-ivory" : "text-brown-700/80 hover:bg-cream"
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-10">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">{FiltersPanel}</aside>

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-brown-700/60">
                {loading ? "Loading products…" : `${filtered.length} ${filtered.length === 1 ? "product" : "products"}`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="flex items-center gap-1.5 rounded-full border border-sandalwood-light px-3.5 py-2 text-xs font-medium text-brown-700/80 lg:hidden"
                >
                  <SlidersHorizontal size={13} /> Filters
                </button>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-full border border-sandalwood-light bg-ivory px-3.5 py-2 text-xs font-medium text-brown-700/80 outline-none"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      Sort: {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-ivory" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-sandalwood-light py-24 text-center text-brown-700/60">
                No products match these filters yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
                {filtered.map((p, i) => (
                  <ProductCard key={p.slug} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-brown-700/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-xs overflow-y-auto bg-ivory p-6 shadow-lift">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-serif text-lg text-maroon-900">Filters</span>
              <button onClick={() => setFiltersOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream">
                <X size={18} />
              </button>
            </div>
            {FiltersPanel}
          </div>
        </div>
      )}
    </section>
  );
}
