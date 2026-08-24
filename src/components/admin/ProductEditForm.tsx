"use client";

import { useState, useTransition } from "react";
import { Check, Save } from "lucide-react";
import { updateProduct } from "@/app/admin/actions";

interface ProductRow {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category_slug: string;
  price: number | null;
  mrp: number | null;
  status: string;
}

const field =
  "w-full rounded-lg border border-sandalwood-light bg-cream px-3 py-2.5 text-sm outline-none focus:border-maroon-600";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-brown-700/55";

export function ProductEditForm({
  product,
  categories,
}: {
  product: ProductRow;
  categories: { slug: string; name: string }[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState(product.status);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateProduct(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    });
  }

  return (
    <form action={handleSubmit} className="rounded-2xl border border-sandalwood-light bg-ivory p-5">
      <input type="hidden" name="slug" value={product.slug} />

      <div className="space-y-4">
        <div>
          <label className={label} htmlFor="name">Product name</label>
          <input id="name" name="name" required defaultValue={product.name} className={field} />
        </div>

        <div>
          <label className={label} htmlFor="tagline">Tagline</label>
          <input
            id="tagline"
            name="tagline"
            defaultValue={product.tagline}
            placeholder="Short line shown above the product name"
            className={field}
          />
        </div>

        <div>
          <label className={label} htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            defaultValue={product.description}
            className={field}
          />
        </div>

        <div>
          <label className={label} htmlFor="category_slug">Category</label>
          <select
            id="category_slug"
            name="category_slug"
            defaultValue={product.category_slug}
            className={field}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label} htmlFor="price">Selling price ₹</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="1"
              defaultValue={product.price ?? ""}
              placeholder="—"
              className={field}
            />
          </div>
          <div>
            <label className={label} htmlFor="mrp">MRP ₹</label>
            <input
              id="mrp"
              name="mrp"
              type="number"
              min="0"
              step="1"
              defaultValue={product.mrp ?? ""}
              placeholder="—"
              className={field}
            />
          </div>
          <div>
            <label className={label} htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={field}
            >
              <option value="active">Live — can be bought</option>
              <option value="price_on_request">Price on request</option>
              <option value="coming_soon">Coming soon</option>
            </select>
          </div>
        </div>

        {status === "active" && (
          <p className="rounded-lg bg-cream px-3 py-2 text-xs text-brown-700/70">
            A live product needs a selling price. Leave MRP blank if there&rsquo;s no discount.
          </p>
        )}

        {error && (
          <p className="rounded-lg bg-temple-red/10 px-3 py-2.5 text-xs text-temple-red">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-5 flex items-center gap-2 rounded-full bg-maroon-600 px-5 py-2.5 text-sm font-semibold text-ivory hover:bg-maroon-700 disabled:opacity-60"
      >
        {saved ? <Check size={16} /> : <Save size={16} />}
        {pending ? "Saving…" : saved ? "Saved" : "Save changes"}
      </button>
    </form>
  );
}
