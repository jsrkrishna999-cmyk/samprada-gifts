"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Package } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { mockOrders } from "@/lib/data/mock-account";
import { getProductBySlug } from "@/lib/data/products";
import { formatINR, cn } from "@/lib/utils";
import type { Order } from "@/lib/types";

const statusStyles: Record<Order["status"], string> = {
  processing: "bg-gold-light text-maroon-900",
  shipped: "bg-maroon-100 text-maroon-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const [openId, setOpenId] = useState<string | null>(mockOrders[0]?.id ?? null);

  if (mockOrders.length === 0) {
    return (
      <Container className="flex flex-col items-center py-28 text-center">
        <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-ivory text-maroon-600">
          <Package size={30} />
        </div>
        <h1 className="font-serif text-2xl text-maroon-900">No orders yet</h1>
        <LinkButton href="/shop" className="mt-6">
          Start Shopping
        </LinkButton>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <SectionHeading eyebrow="My orders" title="Order History" className="mb-8" />

      <div className="space-y-4">
        {mockOrders.map((order) => {
          const open = openId === order.id;
          return (
            <div key={order.id} className="overflow-hidden rounded-2xl border border-sandalwood-light bg-ivory">
              <button
                onClick={() => setOpenId(open ? null : order.id)}
                className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-cream text-maroon-600">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-maroon-900">{order.id}</p>
                    <p className="text-xs text-brown-700/50">Placed on {order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn("rounded-full px-3 py-1 text-xs font-semibold capitalize", statusStyles[order.status])}>
                    {order.status}
                  </span>
                  <span className="font-semibold text-maroon-900">{formatINR(order.total)}</span>
                  <ChevronDown size={18} className={cn("text-brown-700/40 transition-transform", open && "rotate-180")} />
                </div>
              </button>

              {open && (
                <div className="border-t border-sandalwood-light p-5">
                  <div className="space-y-3">
                    {order.items.map((item) => {
                      const product = getProductBySlug(item.productSlug);
                      return (
                        <div key={item.productSlug} className="flex items-center justify-between text-sm">
                          <Link
                            href={`/product/${item.productSlug}`}
                            className="text-brown-700/80 hover:text-maroon-600"
                          >
                            {product?.name ?? item.productSlug} × {item.quantity}
                          </Link>
                          <span className="text-brown-700/70">{formatINR(item.price * item.quantity)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 grid gap-1 border-t border-sandalwood-light pt-4 text-xs text-brown-700/50">
                    <p>Delivery address: {order.address}</p>
                    <p>Payment method: {order.paymentMethod}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Container>
  );
}
