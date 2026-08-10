"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/cart-context";

export function FrequentlyBoughtTogether({
  main,
  suggestions,
}: {
  main: Product;
  suggestions: Product[];
}) {
  const items = [main, ...suggestions];
  const [selected, setSelected] = useState<Set<string>>(new Set(items.map((p) => p.slug)));
  const { addItem } = useCart();

  const total = items
    .filter((p) => selected.has(p.slug))
    .reduce((sum, p) => sum + p.price, 0);

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function addSelected() {
    items.forEach((p) => {
      if (selected.has(p.slug)) addItem(p.slug, 1, true);
    });
  }

  return (
    <div className="rounded-2xl border border-sandalwood-light bg-ivory p-6">
      <h3 className="mb-5 font-serif text-xl text-maroon-900">
        Frequently Bought Together
      </h3>
      <div className="flex flex-wrap items-center gap-3">
        {items.map((p, i) => (
          <div key={p.slug} className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={selected.has(p.slug)}
                onChange={() => toggle(p.slug)}
                className="h-4 w-4 accent-maroon-600"
              />
              <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                <Image src={p.images[0]} alt={p.name} fill sizes="64px" className="object-cover" />
              </div>
              <div className="max-w-[130px]">
                <Link href={`/product/${p.slug}`} className="line-clamp-2 text-xs font-medium text-brown-700 hover:text-maroon-600">
                  {p.name}
                </Link>
                <p className="text-xs font-semibold text-maroon-700">{formatINR(p.price)}</p>
              </div>
            </label>
            {i < items.length - 1 && <Plus size={16} className="text-brown-700/30" />}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-sandalwood-light pt-5">
        <p className="text-sm text-brown-700/70">
          Total for {selected.size} items:{" "}
          <span className="font-semibold text-maroon-900">{formatINR(total)}</span>
        </p>
        <Button onClick={addSelected} disabled={selected.size === 0}>
          <ShoppingBag size={16} /> Add Selected to Cart
        </Button>
      </div>
    </div>
  );
}
