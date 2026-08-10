"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { RatingStars } from "@/components/ui/RatingStars";
import { cn } from "@/lib/utils";

const tabs = ["Description", "Specifications", "Packaging & Shipping", "Reviews"] as const;
type Tab = (typeof tabs)[number];

export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<Tab>("Description");

  return (
    <div className="mt-16">
      <div className="flex gap-1 overflow-x-auto border-b border-sandalwood-light">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={cn(
              "shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              active === t
                ? "border-maroon-600 text-maroon-700"
                : "border-transparent text-brown-700/50 hover:text-brown-700"
            )}
          >
            {t === "Reviews" ? `Reviews (${product.reviewCount})` : t}
          </button>
        ))}
      </div>

      <div className="py-8">
        {active === "Description" && (
          <div className="max-w-2xl space-y-4 text-brown-700/80">
            <p>{product.description}</p>
            <ul className="space-y-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-sm">
                  <span className="text-gold-dark">•</span> {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {active === "Specifications" && (
          <div className="max-w-xl divide-y divide-sandalwood-light/70 overflow-hidden rounded-xl border border-sandalwood-light">
            {product.specifications.map((s) => (
              <div key={s.label} className="grid grid-cols-2 gap-4 px-5 py-3 text-sm odd:bg-ivory">
                <span className="font-medium text-brown-700/60">{s.label}</span>
                <span className="text-brown-700">{s.value}</span>
              </div>
            ))}
          </div>
        )}

        {active === "Packaging & Shipping" && (
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="mb-3 font-serif text-lg text-maroon-900">Packaging</h4>
              <ul className="space-y-2.5 text-sm text-brown-700/80">
                {product.packaging.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-gold-dark">•</span> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-serif text-lg text-maroon-900">Shipping</h4>
              <ul className="space-y-2.5 text-sm text-brown-700/80">
                {product.shipping.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span className="text-gold-dark">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {active === "Reviews" && (
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-4 rounded-xl bg-ivory p-5">
              <span className="font-serif text-4xl text-maroon-900">
                {product.rating.toFixed(1)}
              </span>
              <div>
                <RatingStars rating={product.rating} size={16} />
                <p className="mt-1 text-xs text-brown-700/60">
                  Based on {product.reviewCount} reviews
                </p>
              </div>
            </div>
            <div className="space-y-5">
              {product.reviews.map((r) => (
                <div key={r.id} className="border-b border-sandalwood-light/70 pb-5">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-maroon-900">{r.title}</p>
                    <span className="text-xs text-brown-700/50">{r.date}</span>
                  </div>
                  <RatingStars rating={r.rating} className="mt-1" />
                  <p className="mt-2 text-sm text-brown-700/75">{r.body}</p>
                  <p className="mt-2 text-xs font-medium text-brown-700/50">
                    {r.author} {r.verified && "· Verified Purchase"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
