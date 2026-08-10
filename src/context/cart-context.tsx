"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "@/lib/types";
import { getProductBySlug } from "@/lib/data/products";
import { useToast } from "./toast-context";

const STORAGE_KEY = "sg_cart_v1";

interface CartContextValue {
  items: CartItem[];
  addItem: (slug: string, quantity?: number, silent?: boolean) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  toggleGiftWrap: (slug: string, giftWrap: boolean) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
  originalSubtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback(
    (slug: string, quantity = 1, silent = false) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productSlug === slug);
        if (existing) {
          return prev.map((i) =>
            i.productSlug === slug ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [...prev, { productSlug: slug, quantity }];
      });
      if (!silent) {
        const product = getProductBySlug(slug);
        show(`${product?.name ?? "Item"} added to cart`, "cart");
      }
    },
    [show]
  );

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.productSlug !== slug));
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productSlug !== slug)
        : prev.map((i) => (i.productSlug === slug ? { ...i, quantity } : i))
    );
  }, []);

  const toggleGiftWrap = useCallback((slug: string, giftWrap: boolean) => {
    setItems((prev) =>
      prev.map((i) => (i.productSlug === slug ? { ...i, giftWrap } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { count, subtotal, originalSubtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    let originalSubtotal = 0;
    for (const item of items) {
      const product = getProductBySlug(item.productSlug);
      if (!product) continue;
      count += item.quantity;
      subtotal += product.price * item.quantity + (item.giftWrap ? 40 : 0);
      originalSubtotal += product.mrp * item.quantity;
    }
    return { count, subtotal, originalSubtotal };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        toggleGiftWrap,
        clearCart,
        count,
        subtotal,
        originalSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
