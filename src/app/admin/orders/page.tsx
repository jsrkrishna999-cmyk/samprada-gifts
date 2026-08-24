import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatINR } from "@/lib/utils";
import { OrderStatusPill } from "@/components/admin/OrderStatusPill";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, customer_phone, city, total, status, payment_status, payment_method, created_at")
    .order("created_at", { ascending: false });

  const list = orders ?? [];

  return (
    <div>
      <header className="mb-5">
        <h1 className="font-serif text-2xl text-maroon-900">Orders</h1>
        <p className="mt-1 text-sm text-brown-700/60">
          {list.length} {list.length === 1 ? "order" : "orders"} placed.
        </p>
      </header>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sandalwood-light bg-ivory py-20 text-center">
          <ShoppingCart size={28} className="mx-auto mb-3 text-brown-700/30" />
          <p className="font-medium text-maroon-900">No orders yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-brown-700/60">
            When a customer completes checkout, the order appears here with their
            contact and delivery details.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((o) => (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id}`}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-sandalwood-light bg-ivory p-4 transition-colors hover:border-maroon-600/50"
            >
              <div className="min-w-[130px]">
                <p className="font-medium text-maroon-900">{o.order_number}</p>
                <p className="text-xs text-brown-700/50">
                  {new Date(o.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="min-w-[160px] flex-1">
                <p className="text-sm text-brown-700/85">{o.customer_name}</p>
                <p className="text-xs text-brown-700/50">
                  {o.customer_phone} · {o.city}
                </p>
              </div>
              <OrderStatusPill status={o.status} paymentStatus={o.payment_status} />
              <div className="ml-auto text-right">
                <p className="font-semibold text-maroon-900">{formatINR(o.total)}</p>
                <p className="text-xs uppercase tracking-wide text-brown-700/45">
                  {o.payment_method}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
