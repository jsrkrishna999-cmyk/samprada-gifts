"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Package } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";
import { formatINR, cn } from "@/lib/utils";

interface OrderRow {
  id: string;
  order_number: string;
  created_at: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  payment_method: string;
  total: number;
  address_line1: string;
  city: string;
  pincode: string;
  order_items: {
    id: string;
    product_slug: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }[];
}

const statusStyles: Record<OrderRow["status"], string> = {
  processing: "bg-gold-light text-maroon-900",
  shipped: "bg-maroon-100 text-maroon-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const supabase = createClient();

    async function load() {
      const { data } = await supabase
        .from("orders")
        .select(
          "id, order_number, created_at, status, payment_method, total, address_line1, city, pincode, order_items(id, product_slug, product_name, quantity, unit_price, line_total)"
        )
        .order("created_at", { ascending: false });

      if (cancelled) return;
      const rows = (data ?? []) as unknown as OrderRow[];
      setOrders(rows);
      setOpenId(rows[0]?.id ?? null);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <Container className="py-20 text-center text-sm text-brown-700/60">
        Loading your orders…
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="flex flex-col items-center py-28 text-center">
        <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-ivory text-maroon-600">
          <Package size={30} />
        </div>
        <h1 className="font-serif text-2xl text-maroon-900">Log in to see your orders</h1>
        <LinkButton href="/login?next=/orders" className="mt-6">
          Log In
        </LinkButton>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container className="flex flex-col items-center py-28 text-center">
        <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-ivory text-maroon-600">
          <Package size={30} />
        </div>
        <h1 className="font-serif text-2xl text-maroon-900">No orders yet</h1>
        <p className="mt-2 max-w-sm text-brown-700/60">
          Once you place an order it&rsquo;ll show up here with live status updates.
        </p>
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
        {orders.map((order) => {
          const open = openId === order.id;
          return (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-sandalwood-light bg-ivory"
            >
              <button
                onClick={() => setOpenId(open ? null : order.id)}
                className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-cream text-maroon-600">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-maroon-900">{order.order_number}</p>
                    <p className="text-xs text-brown-700/50">
                      Placed on{" "}
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                      statusStyles[order.status]
                    )}
                  >
                    {order.status}
                  </span>
                  <span className="font-semibold text-maroon-900">{formatINR(order.total)}</span>
                  <ChevronDown
                    size={18}
                    className={cn("text-brown-700/40 transition-transform", open && "rotate-180")}
                  />
                </div>
              </button>

              {open && (
                <div className="border-t border-sandalwood-light p-5">
                  <div className="space-y-3">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <Link
                          href={`/product/${item.product_slug}`}
                          className="text-brown-700/80 hover:text-maroon-600"
                        >
                          {item.product_name} × {item.quantity}
                        </Link>
                        <span className="text-brown-700/70">{formatINR(item.line_total)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-1 border-t border-sandalwood-light pt-4 text-xs text-brown-700/50">
                    <p>
                      Delivery address: {order.address_line1}, {order.city} {order.pincode}
                    </p>
                    <p>Payment method: {order.payment_method}</p>
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
