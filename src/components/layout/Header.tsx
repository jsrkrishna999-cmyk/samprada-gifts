"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AnimatedBadge } from "@/components/ui/AnimatedBadge";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useAuth } from "@/context/auth-context";
import { useCatalog } from "@/context/catalog-context";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();
  const { slugs } = useWishlist();
  const { user } = useAuth();
  const { categories } = useCatalog();
  const pathname = usePathname();

  return (
    <>
      <div className="bg-maroon-600 py-2 text-center text-xs font-medium tracking-wide text-ivory">
        Free shipping on prepaid orders above ₹2,500 · Bulk gifting? Talk to us
      </div>

      <header className="sticky top-0 z-40 glass border-b border-sandalwood-light/60">
        <Container className="flex h-18 items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-maroon-600 font-serif text-lg text-gold-light">
              S
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-serif text-lg font-semibold text-maroon-900">
                Samprada
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold-dark">
                Gifts
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <div key={link.href} className="group relative">
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm font-medium text-brown-700/80 transition-colors hover:text-maroon-600",
                    pathname === link.href && "text-maroon-600"
                  )}
                >
                  {link.label}
                </Link>
                {link.label === "Categories" && (
                  <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="grid grid-cols-1 gap-1 rounded-xl border border-sandalwood-light bg-ivory p-2 shadow-lift">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/category/${c.slug}`}
                          className="rounded-lg px-3 py-2 text-sm text-brown-700/80 hover:bg-cream hover:text-maroon-600"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full text-brown-700/80 transition-colors hover:bg-cream hover:text-maroon-600"
            >
              <Search size={19} />
            </button>
            <Link
              href={user ? "/account" : "/login"}
              aria-label="Account"
              className="hidden h-10 w-10 place-items-center rounded-full text-brown-700/80 transition-colors hover:bg-cream hover:text-maroon-600 sm:grid"
            >
              <User size={19} />
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative grid h-10 w-10 place-items-center rounded-full text-brown-700/80 transition-colors hover:bg-cream hover:text-maroon-600"
            >
              <Heart size={19} />
              <AnimatedBadge value={slugs.length} tone="red" />
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative grid h-10 w-10 place-items-center rounded-full text-brown-700/80 transition-colors hover:bg-cream hover:text-maroon-600"
            >
              <ShoppingBag size={19} />
              <AnimatedBadge value={count} tone="maroon" />
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full text-brown-700/80 hover:bg-cream hover:text-maroon-600 lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </Container>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-sandalwood-light/60 bg-ivory"
            >
              <Container className="py-4">
                <div className="flex items-center gap-3 rounded-full border border-sandalwood-light bg-cream px-4 py-2.5">
                  <Search size={16} className="text-brown-700/50" />
                  <input
                    autoFocus
                    type="search"
                    aria-label="Search products"
                    placeholder="Search for diyas, potlis, hampers..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-brown-700/40"
                  />
                </div>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-brown-700/50 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
              className="fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm bg-ivory p-6 shadow-lift lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-serif text-lg text-maroon-900">Menu</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-brown-700 hover:bg-cream hover:text-maroon-600"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href={user ? "/account" : "/login"}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-brown-700 hover:bg-cream hover:text-maroon-600"
                >
                  {user ? "My Account" : "Login / Signup"}
                </Link>
              </nav>
              <div className="mt-8 border-t border-sandalwood-light pt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-dark">
                  Shop by category
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/category/${c.slug}`}
                      onClick={() => setOpen(false)}
                      className="rounded-full border border-sandalwood-light px-3 py-1.5 text-xs text-brown-700/80 hover:border-maroon-600 hover:text-maroon-600"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
