import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductAdminTable } from "@/components/admin/ProductAdminTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const { filter, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("slug, name, tagline, images, price, mrp, status, source, category_slug")
    .order("status")
    .order("name");

  if (filter === "unpriced") query = query.is("price", null);
  if (q) query = query.ilike("name", `%${q}%`);

  const [{ data: products }, { data: categories }] = await Promise.all([
    query,
    supabase.from("categories").select("slug, name").order("name"),
  ]);

  const filters = [
    { key: undefined, label: "All" },
    { key: "unpriced", label: "Needs a price" },
  ];

  return (
    <div>
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-maroon-900">Products</h1>
          <p className="mt-1 text-sm text-brown-700/60">
            Set prices, edit details, and upload photos.
          </p>
        </div>
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <Link
              key={f.label}
              href={f.key ? `/admin/products?filter=${f.key}` : "/admin/products"}
              className={
                (f.key ?? undefined) === filter
                  ? "rounded-full bg-maroon-600 px-3.5 py-1.5 text-xs font-semibold text-ivory"
                  : "rounded-full border border-sandalwood-light px-3.5 py-1.5 text-xs font-medium text-brown-700/80 hover:border-maroon-600 hover:text-maroon-600"
              }
            >
              {f.label}
            </Link>
          ))}
        </div>
      </header>

      <ProductAdminTable
        products={products ?? []}
        categories={categories ?? []}
      />
    </div>
  );
}
