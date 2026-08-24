import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatINR } from "@/lib/utils";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: items }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).maybeSingle(),
    supabase.from("order_items").select("*").eq("order_id", id),
  ]);

  if (!order) notFound();
  const lines = items ?? [];

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-brown-700/70 hover:text-maroon-600"
      >
        <ArrowLeft size={15} /> All orders
      </Link>

      <header className="mb-6">
        <h1 className="font-serif text-2xl text-maroon-900">{order.order_number}</h1>
        <p className="mt-1 text-sm text-brown-700/60">
          Placed{" "}
          {new Date(order.created_at).toLocaleString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-sandalwood-light bg-ivory p-5">
            <h2 className="mb-4 font-serif text-base text-maroon-900">Items</h2>
            <div className="space-y-3">
              {lines.map((it) => (
                <div key={it.id} className="flex items-start justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <Link
                      href={`/product/${it.product_slug}`}
                      className="text-brown-700/85 hover:text-maroon-600"
                    >
                      {it.product_name}
                    </Link>
                    <p className="text-xs text-brown-700/50">
                      {formatINR(it.unit_price)} × {it.quantity}
                      {it.gift_wrap && " · gift wrapped"}
                    </p>
                  </div>
                  <span className="shrink-0 font-medium text-maroon-900">
                    {formatINR(it.line_total)}
                  </span>
                </div>
              ))}
            </div>

            <dl className="mt-5 space-y-2 border-t border-sandalwood-light pt-4 text-sm">
              <div className="flex justify-between text-brown-700/70">
                <dt>Subtotal</dt>
                <dd>{formatINR(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-temple-red">
                  <dt>Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</dt>
                  <dd>-{formatINR(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-brown-700/70">
                <dt>Delivery</dt>
                <dd>{order.delivery_fee === 0 ? "Free" : formatINR(order.delivery_fee)}</dd>
              </div>
              <div className="flex justify-between border-t border-sandalwood-light pt-2 font-serif text-lg text-maroon-900">
                <dt>Total</dt>
                <dd>{formatINR(order.total)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-sandalwood-light bg-ivory p-5">
            <h2 className="mb-3 font-serif text-base text-maroon-900">Customer & delivery</h2>
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brown-700/50">
                  Contact
                </p>
                <p className="text-brown-700/85">{order.customer_name}</p>
                <p className="text-brown-700/70">
                  <a href={`tel:${order.customer_phone}`} className="hover:text-maroon-600">
                    {order.customer_phone}
                  </a>
                </p>
                {order.customer_email && (
                  <p className="break-all text-brown-700/70">
                    <a href={`mailto:${order.customer_email}`} className="hover:text-maroon-600">
                      {order.customer_email}
                    </a>
                  </p>
                )}
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brown-700/50">
                  Ship to
                </p>
                <address className="not-italic text-brown-700/85">
                  {order.address_line1}
                  {order.address_line2 && <>, {order.address_line2}</>}
                  <br />
                  {order.city}, {order.state} {order.pincode}
                </address>
              </div>
            </div>
          </section>
        </div>

        <OrderStatusForm
          id={order.id}
          status={order.status}
          paymentStatus={order.payment_status}
          paymentMethod={order.payment_method}
        />
      </div>
    </div>
  );
}
