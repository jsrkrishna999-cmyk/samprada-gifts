import Link from "next/link";
import { AlertTriangle, IndianRupee, Package, ShoppingCart, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatINR } from "@/lib/utils";
import { StatCard } from "@/components/admin/StatCard";
import { OrderStatusPill } from "@/components/admin/OrderStatusPill";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ data: orders }, { count: productCount }, { count: unpricedCount }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, order_number, customer_name, total, status, payment_status, created_at, user_id")
      .order("created_at", { ascending: false }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .is("price", null),
  ]);

  const allOrders = orders ?? [];
  // Revenue counts only money actually collected, not orders merely placed.
  const paidOrders = allOrders.filter((o) => o.payment_status === "paid");
  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const customers = new Set(allOrders.map((o) => o.user_id).filter(Boolean)).size;
  const pending = allOrders.filter((o) => o.status === "processing").length;

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-serif text-2xl text-maroon-900">Dashboard</h1>
        <p className="mt-1 text-sm text-brown-700/60">
          Everything happening across your store right now.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total orders"
          value={String(allOrders.length)}
          hint={pending > 0 ? `${pending} awaiting dispatch` : "None awaiting dispatch"}
          icon={ShoppingCart}
        />
        <StatCard
          label="Revenue collected"
          value={formatINR(revenue)}
          hint={`${paidOrders.length} paid ${paidOrders.length === 1 ? "order" : "orders"}`}
          icon={IndianRupee}
        />
        <StatCard
          label="Customers"
          value={String(customers)}
          hint="With at least one order"
          icon={Users}
        />
        <StatCard
          label="Products"
          value={String(productCount ?? 0)}
          hint={
            unpricedCount ? `${unpricedCount} still need a price` : "All products priced"
          }
          icon={Package}
          tone={unpricedCount ? "warn" : "default"}
        />
      </div>

      {!!unpricedCount && (
        <Link
          href="/admin/products?filter=unpriced"
          className="mt-4 flex items-start gap-3 rounded-xl border border-gold/40 bg-gold-light/20 p-4 transition-colors hover:bg-gold-light/30"
        >
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-gold-dark" />
          <div>
            <p className="text-sm font-semibold text-maroon-900">
              {unpricedCount} products have no price
            </p>
            <p className="mt-0.5 text-xs text-brown-700/70">
              They show as &ldquo;Price on request&rdquo; and can&rsquo;t be added to a cart.
              Set prices to start selling them.
            </p>
          </div>
        </Link>
      )}

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-lg text-maroon-900">Recent orders</h2>
          {allOrders.length > 0 && (
            <Link href="/admin/orders" className="text-xs font-semibold text-maroon-600 hover:text-maroon-700">
              View all
            </Link>
          )}
        </div>

        {allOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sandalwood-light bg-ivory py-16 text-center">
            <ShoppingCart size={26} className="mx-auto mb-3 text-brown-700/30" />
            <p className="text-sm font-medium text-maroon-900">No orders yet</p>
            <p className="mx-auto mt-1 max-w-sm text-xs text-brown-700/60">
              Orders placed at checkout will appear here with customer details and status.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-sandalwood-light bg-ivory">
            <table className="w-full text-sm">
              <thead className="border-b border-sandalwood-light bg-cream/60 text-left text-xs uppercase tracking-wider text-brown-700/60">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.slice(0, 8).map((o) => (
                  <tr key={o.id} className="border-b border-sandalwood-light/60 last:border-0">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="font-medium text-maroon-700 hover:text-maroon-600"
                      >
                        {o.order_number}
                      </Link>
                      <p className="text-xs text-brown-700/50">
                        {new Date(o.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-brown-700/80">{o.customer_name}</td>
                    <td className="px-4 py-3">
                      <OrderStatusPill status={o.status} paymentStatus={o.payment_status} />
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-maroon-900">
                      {formatINR(o.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
