"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, PackageCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { ShareButton } from "@/components/ui/ShareButton";
import { formatINR } from "@/lib/utils";

interface LastOrder {
  orderId: string;
  total: number;
  payment: string;
  items: number;
}

export function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") ?? "SG-000000";
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem("sg_last_order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <Container className="flex flex-col items-center py-20 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="mb-6 grid h-24 w-24 place-items-center rounded-full bg-green-50"
      >
        <CheckCircle2 className="text-green-600" size={48} strokeWidth={1.5} />
      </motion.div>

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
        Order Confirmed
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-maroon-900 sm:text-4xl">
        Thank you for your order!
      </h1>
      <p className="mt-3 max-w-md text-brown-700/70">
        Your order <span className="font-semibold text-maroon-700">{orderId}</span> has
        been placed successfully. We&rsquo;ll send updates as it&rsquo;s packed and shipped.
      </p>

      <div className="mt-8 w-full max-w-sm rounded-2xl border border-sandalwood-light bg-ivory p-6 text-left">
        <div className="flex items-center gap-3 border-b border-sandalwood-light pb-4">
          <PackageCheck className="text-maroon-600" size={22} />
          <div>
            <p className="text-sm font-medium text-maroon-900">Order {orderId}</p>
            <p className="text-xs text-brown-700/50">Processing — dispatch in 24-48 hrs</p>
          </div>
        </div>
        <div className="space-y-2 pt-4 text-sm text-brown-700/70">
          <div className="flex justify-between">
            <span>Items</span>
            <span>{order?.items ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment method</span>
            <span className="capitalize">{order?.payment ?? "—"}</span>
          </div>
          <div className="flex justify-between font-semibold text-maroon-900">
            <span>Total paid</span>
            <span>{order ? formatINR(order.total) : "—"}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full max-w-sm rounded-2xl border border-sandalwood-light bg-cream/60 p-5 text-center">
        <p className="text-sm font-medium text-maroon-900">Loved shopping with us?</p>
        <p className="mx-auto mt-1 max-w-xs text-xs text-brown-700/65">
          Share Samprada Gifts with friends and family planning their own celebrations.
        </p>
        <div className="mt-4 flex justify-center">
          <ShareButton
            url="/"
            title="Samprada Gifts"
            text="I just ordered return gifts from Samprada Gifts — beautiful traditional favours for weddings, poojas and festivals."
            label="Share Samprada Gifts"
            variant="button"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <LinkButton href="/orders" variant="outline">
          View Order History
        </LinkButton>
        <LinkButton href="/shop">Continue Shopping</LinkButton>
      </div>
    </Container>
  );
}
