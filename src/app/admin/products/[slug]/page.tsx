import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductEditForm } from "@/components/admin/ProductEditForm";
import { ProductImageManager } from "@/components/admin/ProductImageManager";

export const dynamic = "force-dynamic";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }, { data: cost }] = await Promise.all([
    supabase.from("products").select("*").eq("slug", slug).maybeSingle(),
    supabase.from("categories").select("slug, name").order("name"),
    supabase.from("product_costs").select("product_code, cost_price").eq("product_slug", slug).maybeSingle(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-brown-700/70 hover:text-maroon-600"
      >
        <ArrowLeft size={15} /> All products
      </Link>

      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-maroon-900">{product.name}</h1>
          <p className="mt-1 font-mono text-xs text-brown-700/50">{product.slug}</p>
        </div>
        <Link
          href={`/product/${product.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-full border border-sandalwood-light px-3.5 py-2 text-xs font-medium text-brown-700/80 hover:border-maroon-600 hover:text-maroon-600"
        >
          View on site <ExternalLink size={13} />
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <ProductEditForm product={product} categories={categories ?? []} />
        <div className="space-y-4">
          <ProductImageManager slug={product.slug} images={product.images} />
          {cost && (
            <div className="rounded-2xl border border-sandalwood-light bg-ivory p-5">
              <h3 className="mb-1 font-serif text-base text-maroon-900">Supplier cost</h3>
              <p className="mb-3 text-xs text-brown-700/55">
                Private — never shown on the storefront.
              </p>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-brown-700/60">Product code</dt>
                  <dd className="font-mono text-brown-700">{cost.product_code}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-brown-700/60">Cost price</dt>
                  <dd className="font-semibold text-maroon-900">
                    {cost.cost_price == null ? "—" : `₹${cost.cost_price}`}
                  </dd>
                </div>
                {cost.cost_price != null && product.price != null && (
                  <div className="flex justify-between border-t border-sandalwood-light pt-1.5">
                    <dt className="text-brown-700/60">Margin</dt>
                    <dd className="font-semibold text-green-700">
                      ₹{(product.price - cost.cost_price).toFixed(2)} (
                      {Math.round(((product.price - cost.cost_price) / product.price) * 100)}%)
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
