"use client";

import { ToastProvider } from "./toast-context";
import { CatalogProvider } from "./catalog-context";
import { CartProvider } from "./cart-context";
import { WishlistProvider } from "./wishlist-context";
import { AuthProvider } from "./auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CatalogProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>{children}</CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </CatalogProvider>
    </ToastProvider>
  );
}
