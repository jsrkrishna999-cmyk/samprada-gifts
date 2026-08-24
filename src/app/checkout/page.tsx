"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Banknote,
  CreditCard,
  Landmark,
  Smartphone,
  Ticket,
  Wallet,
} from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { useAuth } from "@/context/auth-context";
import { placeOrder } from "@/lib/orders";
import { mockAddresses } from "@/lib/data/mock-account";
import { formatINR } from "@/lib/utils";

const deliveryOptions = [
  { id: "standard", label: "Standard Delivery", eta: "4-6 business days", fee: 0 },
  { id: "express", label: "Express Delivery", eta: "1-2 business days", fee: 149 },
];

const paymentOptions = [
  { id: "upi", label: "UPI", icon: Smartphone, note: "GPay, PhonePe, Paytm & more" },
  { id: "razorpay", label: "Razorpay Checkout", icon: Wallet, note: "Cards, UPI, wallets in one flow" },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, note: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: Landmark, note: "All major Indian banks" },
  { id: "cod", label: "Cash on Delivery", icon: Banknote, note: "Available on orders under ₹5,000" },
];

const coupons: Record<string, number> = {
  FESTIVE10: 0.1,
  SAMPRADA5: 0.05,
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { show } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const defaultAddress = mockAddresses[0];
  const [form, setForm] = useState({
    fullName: defaultAddress?.fullName ?? "",
    phone: defaultAddress?.phone ?? "",
    line1: defaultAddress?.line1 ?? "",
    line2: defaultAddress?.line2 ?? "",
    city: defaultAddress?.city ?? "",
    state: defaultAddress?.state ?? "",
    pincode: defaultAddress?.pincode ?? "",
  });
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("upi");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  const deliveryFee = deliveryOptions.find((d) => d.id === delivery)?.fee ?? 0;
  const discount = appliedCoupon ? Math.round(subtotal * coupons[appliedCoupon]) : 0;
  const total = subtotal - discount + deliveryFee;

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (coupons[code]) {
      setAppliedCoupon(code);
      show(`Coupon ${code} applied`, "info");
    } else {
      show("Invalid coupon code", "info");
    }
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!user) {
      router.push("/login?next=/checkout");
      return;
    }

    setPlacing(true);
    const result = await placeOrder({
      customer: form,
      items,
      paymentMethod: paymentOptions.find((p) => p.id === payment)?.label ?? payment,
      subtotal,
      discount,
      deliveryFee,
      total,
      couponCode: appliedCoupon,
    });
    setPlacing(false);

    if (result.error || !result.orderNumber) {
      setError(result.error ?? "Could not place the order.");
      return;
    }

    window.sessionStorage.setItem(
      "sg_last_order",
      JSON.stringify({ orderId: result.orderNumber, total, payment, items: items.length })
    );
    clearCart();
    router.push(`/order-success?order=${result.orderNumber}`);
  }

  const disabled = items.length === 0;

  const formattedItems = useMemo(() => items, [items]);

  return (
    <Container className="py-10">
      <SectionHeading eyebrow="Almost there" title="Checkout" className="mb-8" />

      <form onSubmit={handlePlaceOrder} className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-sandalwood-light bg-ivory p-6">
            <h2 className="mb-5 font-serif text-lg text-maroon-900">Shipping Address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} required />
              <Field label="Phone Number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
              <Field label="Address Line 1" value={form.line1} onChange={(v) => setForm({ ...form, line1: v })} className="sm:col-span-2" required />
              <Field label="Address Line 2 (optional)" value={form.line2} onChange={(v) => setForm({ ...form, line2: v })} className="sm:col-span-2" />
              <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
              <Field label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} required />
              <Field label="Pincode" value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} required />
            </div>
          </section>

          <section className="rounded-2xl border border-sandalwood-light bg-ivory p-6">
            <h2 className="mb-5 font-serif text-lg text-maroon-900">Delivery Options</h2>
            <div className="space-y-3">
              {deliveryOptions.map((d) => (
                <label
                  key={d.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                    delivery === d.id ? "border-maroon-600 bg-maroon-50" : "border-sandalwood-light"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={delivery === d.id}
                      onChange={() => setDelivery(d.id)}
                      className="h-4 w-4 accent-maroon-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-brown-700">{d.label}</p>
                      <p className="text-xs text-brown-700/50">{d.eta}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-maroon-900">
                    {d.fee === 0 ? "Free" : formatINR(d.fee)}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-sandalwood-light bg-ivory p-6">
            <h2 className="mb-5 font-serif text-lg text-maroon-900">Payment Method</h2>
            <div className="space-y-3">
              {paymentOptions.map((p) => (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                    payment === p.id ? "border-maroon-600 bg-maroon-50" : "border-sandalwood-light"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === p.id}
                    onChange={() => setPayment(p.id)}
                    className="h-4 w-4 accent-maroon-600"
                  />
                  <p.icon size={18} className="text-maroon-600" />
                  <div>
                    <p className="text-sm font-medium text-brown-700">{p.label}</p>
                    <p className="text-xs text-brown-700/50">{p.note}</p>
                  </div>
                </label>
              ))}
            </div>
            <p className="mt-4 rounded-lg bg-cream px-4 py-3 text-xs text-brown-700/60">
              Demo checkout — this is a front-end prototype. No real payment will
              be processed; Razorpay integration is wired up once backend
              credentials are added.
            </p>
          </section>
        </div>

        <div className="h-fit space-y-5">
          <div className="rounded-2xl border border-sandalwood-light bg-ivory p-6">
            <h3 className="mb-4 font-serif text-lg text-maroon-900">Order Summary</h3>
            <ul className="mb-4 max-h-48 space-y-2 overflow-y-auto text-sm text-brown-700/70">
              {formattedItems.map((i) => (
                <li key={i.productSlug} className="flex justify-between gap-2">
                  <span className="truncate">
                    {i.productSlug.replace(/-/g, " ")} × {i.quantity}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-full border border-sandalwood-light px-3">
                <Ticket size={14} className="text-brown-700/40" />
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  aria-label="Coupon code"
                  placeholder="Coupon code (try FESTIVE10)"
                  className="w-full bg-transparent py-2.5 text-xs outline-none placeholder:text-brown-700/40"
                />
              </div>
              <button
                type="button"
                onClick={applyCoupon}
                className="rounded-full border border-maroon-600 px-4 text-xs font-semibold text-maroon-600 hover:bg-maroon-600 hover:text-ivory"
              >
                Apply
              </button>
            </div>

            <div className="mt-5 space-y-2.5 border-t border-sandalwood-light pt-4 text-sm">
              <div className="flex justify-between text-brown-700/70">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-temple-red">
                  <span>Coupon ({appliedCoupon})</span>
                  <span>-{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-brown-700/70">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? "Free" : formatINR(deliveryFee)}</span>
              </div>
            </div>
            <div className="mt-3 flex justify-between border-t border-sandalwood-light pt-3 font-serif text-lg text-maroon-900">
              <span>Total</span>
              <span>{formatINR(Math.max(total, 0))}</span>
            </div>
          </div>

          {!user && (
            <p className="mt-4 rounded-lg bg-cream px-3.5 py-2.5 text-xs text-brown-700/75">
              You&rsquo;ll be asked to log in before the order is placed, so you can
              track it afterwards.
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-temple-red/10 px-3.5 py-2.5 text-xs text-temple-red">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" disabled={disabled || placing} className="mt-4 w-full">
            {placing
              ? "Placing order..."
              : user
                ? `Place Order — ${formatINR(Math.max(total, 0))}`
                : "Log in to place order"}
          </Button>
        </div>
      </form>
    </Container>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-xs font-medium text-brown-700/70">{label}</span>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-sandalwood-light bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-maroon-600"
      />
    </label>
  );
}
