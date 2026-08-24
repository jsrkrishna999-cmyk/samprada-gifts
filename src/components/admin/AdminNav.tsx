"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Store, Tags } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/categories", label: "Categories", icon: Tags },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="lg:w-60 lg:shrink-0">
      <div className="rounded-2xl border border-sandalwood-light bg-ivory p-4">
        <div className="mb-4 flex items-center gap-2.5 border-b border-sandalwood-light pb-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-maroon-600 font-serif text-base text-gold-light">
            S
          </span>
          <div className="min-w-0">
            <p className="font-serif text-sm font-semibold text-maroon-900">Admin</p>
            <p className="truncate text-[11px] text-brown-700/55">{email}</p>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {links.map((l) => {
            const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-maroon-600 text-ivory"
                    : "text-brown-700/80 hover:bg-cream hover:text-maroon-600"
                )}
              >
                <l.icon size={16} /> {l.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          className="mt-4 flex items-center gap-2.5 border-t border-sandalwood-light px-3 pt-4 text-sm text-brown-700/70 hover:text-maroon-600"
        >
          <Store size={16} /> View storefront
        </Link>
      </div>
    </aside>
  );
}
