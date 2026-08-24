"use client";

import { createClient } from "@/lib/supabase/client";
import type { CartItem } from "@/lib/types";

export interface PlaceOrderInput {
  customer: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: CartItem[];
  paymentMethod: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  couponCode?: string | null;
}

export interface PlaceOrderResult {
  orderNumber: string | null;
  error: string | null;
}

/**
 * Writes a real order. Requires a signed-in user: the RLS insert policy is
 * `auth.uid() = user_id`, so guest checkout would be rejected by the database.
 * The caller is responsible for sending the user to log in first.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { orderNumber: null, error: "Please log in to place your order." };
  }

  // Re-read prices from the database rather than trusting the client cart, so
  // a tampered cart can't create an order at a price you never set.
  const slugs = input.items.map((i) => i.productSlug);
  const { data: products, error: productError } = await supabase
    .from("products")
    .select("slug, name, price, status")
    .in("slug", slugs);

  if (productError) return { orderNumber: null, error: productError.message };

  const priced = new Map(
    (products ?? [])
      .filter((p) => p.status === "active" && p.price != null)
      .map((p) => [p.slug, p as { slug: string; name: string; price: number }])
  );

  const lines = input.items.flatMap((item) => {
    const product = priced.get(item.productSlug);
    if (!product) return [];
    const lineTotal = product.price * item.quantity + (item.giftWrap ? 40 : 0);
    return [
      {
        product_slug: product.slug,
        product_name: product.name,
        unit_price: product.price,
        quantity: item.quantity,
        gift_wrap: !!item.giftWrap,
        line_total: lineTotal,
      },
    ];
  });

  if (lines.length === 0) {
    return { orderNumber: null, error: "None of the items in your cart are available to buy." };
  }

  const subtotal = lines.reduce((sum, l) => sum + l.line_total, 0);
  const total = Math.max(0, subtotal - input.discount + input.deliveryFee);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      customer_name: input.customer.fullName,
      customer_email: user.email ?? null,
      customer_phone: input.customer.phone,
      address_line1: input.customer.line1,
      address_line2: input.customer.line2 || null,
      city: input.customer.city,
      state: input.customer.state,
      pincode: input.customer.pincode,
      payment_method: input.paymentMethod,
      subtotal,
      discount: input.discount,
      delivery_fee: input.deliveryFee,
      total,
      coupon_code: input.couponCode ?? null,
      notes: null,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return { orderNumber: null, error: orderError?.message ?? "Could not create the order." };
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(lines.map((l) => ({ ...l, order_id: order.id })));

  if (itemsError) {
    // Don't leave a total-only order with no lines behind.
    await supabase.from("orders").delete().eq("id", order.id);
    return { orderNumber: null, error: itemsError.message };
  }

  return { orderNumber: order.order_number, error: null };
}
