"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ShoppingBag, Eye } from "lucide-react";
import type { Product } from "@/lib/types";
import { RatingStars } from "./ui/RatingStars";
import { PriceTag } from "./ui/PriceTag";
import { Badge } from "./ui/Badge";
import { WishlistButton } from "./ui/WishlistButton";
import { useCart } from "@/context/cart-context";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleQuickAdd() {
    addItem(product.slug);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-ivory shadow-soft ring-1 ring-sandalwood-light/60 transition-shadow duration-300 hover:shadow-lift"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 90vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badges?.map((b) => (
            <Badge key={b} kind={b} />
          ))}
        </div>

        <WishlistButton
          slug={product.slug}
          className="absolute right-3 top-3 bg-ivory/90 text-maroon-600 shadow-soft backdrop-blur hover:scale-110"
        />

        <div className="absolute inset-x-3 bottom-3 flex translate-y-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <motion.button
            onClick={handleQuickAdd}
            whileTap={{ scale: 0.95 }}
            className="relative flex flex-1 items-center justify-center gap-1.5 overflow-hidden rounded-full bg-maroon-600 px-3 py-2 text-xs font-semibold text-ivory shadow-lift hover:bg-maroon-700"
          >
            <AnimatePresence mode="wait" initial={false}>
              {justAdded ? (
                <motion.span
                  key="added"
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Check size={14} /> Added
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <ShoppingBag size={14} /> Quick Add
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <Link
            href={`/product/${product.slug}`}
            className="flex items-center justify-center gap-1.5 rounded-full bg-ivory px-3 py-2 text-xs font-semibold text-maroon-700 shadow-lift hover:bg-cream"
          >
            <Eye size={14} />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-[11px] uppercase tracking-wider text-gold-dark">
          {product.tagline}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-base font-medium text-maroon-900 hover:text-maroon-600">
            {product.name}
          </h3>
        </Link>
        <RatingStars rating={product.rating} showValue />
        <PriceTag price={product.price} mrp={product.mrp} className="mt-1" />
      </div>
    </motion.div>
  );
}
