"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Pencil, Search } from "lucide-react";
import { updateProductPrice } from "@/app/admin/actions";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Row {
  slug: string;
  name: string;
  tagline: string;
  images: string[];
  price: number | null;
  mrp: number | null;
  status: string;
  source: string;
  category_slug: string;
}

const statusLabel: Record<string, string> = {
  active: "Live",
  price_on_request: "Price on request",
  coming_soon: "Coming soon",
};

const statusTone: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  price_on_request: "bg-gold-light/50 text-maroon-900",
  coming_soon: "bg-sandalwood-light/60 text-brown-700",
};

export function ProductAdminTable({
  products,
  categories,
}: {
  products: Row[];
  categories: { slug: string; name: string }[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const visible = products.filter((p) => {
    if (category && p.category_slug !== category) return false;
    if (!search) return true;
    return p.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-full border border-sandalwood-light bg-ivory px-3.5 py-2">
          <Search size={15} className="shrink-0 text-brown-700/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
            className="w-full bg-transparent text-sm outline-none placeholder:text-brown-700/40"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="rounded-full border border-sandalwood-light bg-ivory px-3.5 py-2 text-sm text-brown-700/80 outline-none"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-3 text-xs text-brown-700/55">
        {visible.length} of {products.length} products
      </p>

      <div className="space-y-2">
        {visible.map((p) => (
          <ProductRow key={p.slug} product={p} />
        ))}
        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-sandalwood-light py-16 text-center text-sm text-brown-700/60">
            No products match.
          </div>
        )}
      </div>
    </>
  );
}

function ProductRow({ product }: { product: Row }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSave(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateProductPrice(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    });
  }

  return (
    <div className="rounded-xl border border-sandalwood-light bg-ivory p-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <Link
            href={`/admin/products/${product.slug}`}
            className="font-medium text-maroon-900 hover:text-maroon-600"
          >
            {product.name}
          </Link>
          <p className="truncate text-xs text-brown-700/50">{product.tagline}</p>
        </div>

        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
            statusTone[product.status]
          )}
        >
          {statusLabel[product.status]}
        </span>

        {editing ? (
          <form action={handleSave} className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="slug" value={product.slug} />
            <label className="sr-only" htmlFor={`price-${product.slug}`}>
              Selling price
            </label>
            <input
              id={`price-${product.slug}`}
              name="price"
              type="number"
              min="0"
              step="1"
              required
              autoFocus
              defaultValue={product.price ?? ""}
              placeholder="Price ₹"
              className="w-24 rounded-lg border border-sandalwood-light bg-cream px-2.5 py-1.5 text-sm outline-none focus:border-maroon-600"
            />
            <label className="sr-only" htmlFor={`mrp-${product.slug}`}>
              MRP
            </label>
            <input
              id={`mrp-${product.slug}`}
              name="mrp"
              type="number"
              min="0"
              step="1"
              defaultValue={product.mrp ?? ""}
              placeholder="MRP ₹"
              className="w-24 rounded-lg border border-sandalwood-light bg-cream px-2.5 py-1.5 text-sm outline-none focus:border-maroon-600"
            />
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-maroon-600 px-3 py-1.5 text-xs font-semibold text-ivory hover:bg-maroon-700 disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setError(null);
              }}
              className="rounded-lg px-2 py-1.5 text-xs text-brown-700/60 hover:text-maroon-600"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex shrink-0 items-center gap-3">
            <div className="text-right">
              {product.price == null ? (
                <span className="text-sm text-brown-700/45">No price</span>
              ) : (
                <>
                  <span className="font-semibold text-maroon-900">
                    {formatINR(product.price)}
                  </span>
                  {product.mrp != null && product.mrp > product.price && (
                    <span className="ml-1.5 text-xs text-brown-700/40 line-through">
                      {formatINR(product.mrp)}
                    </span>
                  )}
                </>
              )}
            </div>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 rounded-lg border border-sandalwood-light px-2.5 py-1.5 text-xs font-medium text-brown-700/80 hover:border-maroon-600 hover:text-maroon-600"
            >
              {saved ? <Check size={13} className="text-green-700" /> : <Pencil size={13} />}
              {saved ? "Saved" : "Price"}
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 rounded-lg bg-temple-red/10 px-3 py-2 text-xs text-temple-red">
          {error}
        </p>
      )}
    </div>
  );
}
