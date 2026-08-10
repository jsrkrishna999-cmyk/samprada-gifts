"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Gift, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { useCart } from "@/context/cart-context";
import { getProductBySlug } from "@/lib/data/products";
import { formatINR } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, toggleGiftWrap, subtotal, originalSubtotal } = useCart();

  const savings = originalSubtotal - subtotal;
  const giftWrapTotal = items.filter((i) => i.giftWrap).length * 40;
  const shipping = subtotal >= 2500 || subtotal === 0 ? 0 : 79;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <Container className="flex flex-col items-center justify-center py-28 text-center">
        <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-ivory text-maroon-600">
          <ShoppingBag size={30} />
        </div>
        <h1 className="font-serif text-2xl text-maroon-900">Your cart is empty</h1>
        <p className="mt-2 max-w-sm text-brown-700/60">
          Explore our collections and find the perfect return gift for your celebration.
        </p>
        <LinkButton href="/shop" className="mt-6">
          Start Shopping <ArrowRight size={16} />
        </LinkButton>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <SectionHeading eyebrow={`${items.length} items`} title="Your Cart" className="mb-8" />

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const product = getProductBySlug(item.productSlug);
              if (!product) return null;
              return (
                <motion.div
                  key={item.productSlug}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-4 rounded-2xl border border-sandalwood-light bg-ivory p-4"
                >
                  <Link href={`/product/${product.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
                    <Image src={product.images[0]} alt={product.name} fill sizes="112px" className="object-cover" />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="font-serif text-base font-medium text-maroon-900 hover:text-maroon-600">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="mt-0.5 text-xs text-brown-700/50">{product.tagline}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productSlug)}
                        aria-label="Remove item"
                        className="shrink-0 text-brown-700/40 hover:text-temple-red"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-sandalwood-light">
                        <button
                          onClick={() => updateQuantity(item.productSlug, item.quantity - 1)}
                          className="grid h-9 w-9 place-items-center text-maroon-600 transition-transform active:scale-90 hover:bg-cream"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productSlug, item.quantity + 1)}
                          className="grid h-9 w-9 place-items-center text-maroon-600 transition-transform active:scale-90 hover:bg-cream"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <label className="flex items-center gap-1.5 text-xs text-brown-700/70">
                        <input
                          type="checkbox"
                          checked={!!item.giftWrap}
                          onChange={(e) => toggleGiftWrap(item.productSlug, e.target.checked)}
                          className="h-3.5 w-3.5 accent-maroon-600"
                        />
                        <Gift size={13} /> Gift wrap (+₹40)
                      </label>

                      <p className="font-semibold text-maroon-900">
                        {formatINR(product.price * item.quantity + (item.giftWrap ? 40 : 0))}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="h-fit rounded-2xl border border-sandalwood-light bg-ivory p-6">
          <h3 className="font-serif text-lg text-maroon-900">Order Summary</h3>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-brown-700/70">
              <span>Subtotal</span>
              <span>{formatINR(subtotal - giftWrapTotal)}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-temple-red">
                <span>You save</span>
                <span>-{formatINR(savings)}</span>
              </div>
            )}
            {giftWrapTotal > 0 && (
              <div className="flex justify-between text-brown-700/70">
                <span>Gift wrap</span>
                <span>{formatINR(giftWrapTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-brown-700/70">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatINR(shipping)}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-sandalwood-light pt-4 font-serif text-lg text-maroon-900">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
          <LinkButton href="/checkout" size="lg" className="mt-6 w-full">
            Proceed to Checkout <ArrowRight size={16} />
          </LinkButton>
          <Link
            href="/shop"
            className="mt-3 block text-center text-xs font-medium text-maroon-600 hover:text-maroon-700"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </Container>
  );
}
