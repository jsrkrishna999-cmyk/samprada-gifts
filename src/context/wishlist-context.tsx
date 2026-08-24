"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useCatalog } from "./catalog-context";
import { useToast } from "./toast-context";

const STORAGE_KEY = "sg_wishlist_v1";

interface WishlistContextValue {
  slugs: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  remove: (slug: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { show } = useToast();
  const { getProductBySlug } = useCatalog();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSlugs(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  }, [slugs, hydrated]);

  const toggle = useCallback(
    (slug: string) => {
      setSlugs((prev) => {
        const exists = prev.includes(slug);
        const product = getProductBySlug(slug);
        show(
          exists
            ? `${product?.name ?? "Item"} removed from wishlist`
            : `${product?.name ?? "Item"} added to wishlist`,
          "wishlist"
        );
        return exists ? prev.filter((s) => s !== slug) : [...prev, slug];
      });
    },
    [show, getProductBySlug]
  );

  const remove = useCallback((slug: string) => {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  return (
    <WishlistContext.Provider value={{ slugs, toggle, has, remove }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
