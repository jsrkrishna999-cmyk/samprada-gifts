"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { RatingStars } from "@/components/ui/RatingStars";
import { PriceTag } from "@/components/ui/PriceTag";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const [stickyVisible, setStickyVisible] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
        {product.tagline}
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-maroon-900 sm:text-4xl">
        {product.name}
      </h1>

      <div className="mt-3 flex items-center gap-3">
        <RatingStars rating={product.rating} showValue />
        <span className="text-sm text-brown-700/50">
          {product.reviewCount} reviews
        </span>
        {product.badges?.map((b) => <Badge key={b} kind={b} />)}
      </div>

      <PriceTag price={product.price} mrp={product.mrp} size="lg" className="mt-5" />
      <p className="mt-1 text-xs text-brown-700/50">Inclusive of all taxes</p>

      <p className="mt-6 text-brown-700/75">{product.description}</p>

      <ul className="mt-5 space-y-2">
        {product.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-sm text-brown-700/80">
            <Check size={16} className="mt-0.5 shrink-0 text-maroon-600" /> {h}
          </li>
        ))}
      </ul>

      <div ref={anchorRef} className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full border border-sandalwood-light">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="grid h-11 w-11 place-items-center text-maroon-600 transition-transform active:scale-90 hover:bg-cream"
          >
            <Minus size={15} />
          </button>
          <span className="w-8 text-center text-sm font-semibold">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
            className="grid h-11 w-11 place-items-center text-maroon-600 transition-transform active:scale-90 hover:bg-cream"
          >
            <Plus size={15} />
          </button>
        </div>

        <Button onClick={() => addItem(product.slug, qty)} size="lg" className="flex-1 sm:flex-none">
          <ShoppingBag size={17} /> Add to Cart
        </Button>

        <WishlistButton slug={product.slug} size="lg" variant="outline" className="shrink-0" />
      </div>

      <div className="mt-6 grid gap-3 rounded-xl bg-ivory p-4 sm:grid-cols-2">
        <div className="flex items-center gap-2.5 text-sm text-brown-700/75">
          <Truck size={16} className="text-maroon-600" /> Dispatched in 24-48 hrs
        </div>
        <div className="flex items-center gap-2.5 text-sm text-brown-700/75">
          <ShieldCheck size={16} className="text-maroon-600" /> Secure checkout
        </div>
      </div>

      {/* Sticky add-to-cart bar */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-sandalwood-light bg-ivory/95 px-4 py-3 shadow-lift backdrop-blur transition-transform duration-300 sm:px-8",
          stickyVisible ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative hidden h-12 w-12 shrink-0 overflow-hidden rounded-lg sm:block">
              <Image src={product.images[0]} alt={product.name} fill sizes="48px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-maroon-900">{product.name}</p>
              <PriceTag price={product.price} mrp={product.mrp} size="sm" />
            </div>
          </div>
          <Button onClick={() => addItem(product.slug, qty)} className="shrink-0">
            <ShoppingBag size={16} /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
