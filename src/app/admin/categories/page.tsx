import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("products").select("category_slug"),
  ]);

  // product_count on the row is a stored value that can drift; show the live
  // count so the admin sees reality, not a stale number.
  const live = new Map<string, number>();
  for (const p of products ?? []) {
    live.set(p.category_slug, (live.get(p.category_slug) ?? 0) + 1);
  }

  return (
    <div>
      <header className="mb-5">
        <h1 className="font-serif text-2xl text-maroon-900">Categories</h1>
        <p className="mt-1 text-sm text-brown-700/60">
          {(categories ?? []).length} categories across the store.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {(categories ?? []).map((c) => {
          const actual = live.get(c.slug) ?? 0;
          const drifted = actual !== c.product_count;
          return (
            <Link
              key={c.slug}
              href={`/admin/products?filter=&q=`}
              className="flex gap-3 rounded-xl border border-sandalwood-light bg-ivory p-3 transition-colors hover:border-maroon-600/50"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-cream">
                {c.image_url && (
                  <Image src={c.image_url} alt="" fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-maroon-900">{c.name}</p>
                <p className="line-clamp-2 text-xs text-brown-700/55">{c.description}</p>
                <p className="mt-1 text-xs text-brown-700/70">
                  {actual} {actual === 1 ? "product" : "products"}
                  {drifted && (
                    <span className="ml-1 text-gold-dark">(listed as {c.product_count})</span>
                  )}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
