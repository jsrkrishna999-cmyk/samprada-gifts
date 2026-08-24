"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/supabase/admin";

export interface ActionResult {
  error: string | null;
}

const ok: ActionResult = { error: null };

/**
 * Every action re-checks admin status server-side. The RLS policies would
 * reject a non-admin anyway, but failing here gives a clear message instead
 * of a silent zero-row update.
 */
async function assertAdmin(): Promise<string | null> {
  const admin = await getAdminUser();
  return admin ? null : "Not authorised.";
}

function parseMoney(value: FormDataEntryValue | null): number | null {
  if (value == null) return null;
  const raw = String(value).trim();
  if (raw === "") return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n);
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function updateProduct(formData: FormData): Promise<ActionResult> {
  const denied = await assertAdmin();
  if (denied) return { error: denied };

  const slug = String(formData.get("slug") ?? "");
  if (!slug) return { error: "Missing product." };

  const price = parseMoney(formData.get("price"));
  const mrp = parseMoney(formData.get("mrp"));
  const status = String(formData.get("status") ?? "");

  if (!["active", "price_on_request", "coming_soon"].includes(status)) {
    return { error: "Invalid status." };
  }
  // Mirrors the products_active_needs_price DB constraint, so the user gets a
  // readable message instead of a Postgres error string.
  if (status === "active" && price == null) {
    return { error: "Set a price before marking a product active." };
  }
  if (price != null && mrp != null && mrp < price) {
    return { error: "MRP cannot be lower than the selling price." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categorySlug = String(formData.get("category_slug") ?? "").trim();

  if (!name) return { error: "Name is required." };
  if (!description) return { error: "Description is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      name,
      tagline,
      description,
      category_slug: categorySlug,
      price,
      mrp,
      status: status as "active" | "price_on_request" | "coming_soon",
      budget_tier: price == null ? null : budgetTier(price),
    })
    .eq("slug", slug);

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${slug}`);
  revalidatePath(`/product/${slug}`);
  revalidatePath("/shop");
  revalidatePath("/");
  return ok;
}

/** Quick inline price edit from the product table. */
export async function updateProductPrice(formData: FormData): Promise<ActionResult> {
  const denied = await assertAdmin();
  if (denied) return { error: denied };

  const slug = String(formData.get("slug") ?? "");
  const price = parseMoney(formData.get("price"));
  const mrp = parseMoney(formData.get("mrp"));
  if (!slug) return { error: "Missing product." };
  if (price == null) return { error: "Enter a price." };
  if (mrp != null && mrp < price) return { error: "MRP cannot be below the price." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      price,
      mrp: mrp ?? price,
      status: "active",
      budget_tier: budgetTier(price),
    })
    .eq("slug", slug);

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath(`/product/${slug}`);
  revalidatePath("/shop");
  revalidatePath("/");
  return ok;
}

export async function setProductImages(slug: string, images: string[]): Promise<ActionResult> {
  const denied = await assertAdmin();
  if (denied) return { error: denied };

  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ images }).eq("slug", slug);
  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${slug}`);
  revalidatePath(`/product/${slug}`);
  revalidatePath("/shop");
  return ok;
}

export async function deleteProduct(formData: FormData): Promise<ActionResult> {
  const denied = await assertAdmin();
  if (denied) return { error: denied };

  const slug = String(formData.get("slug") ?? "");
  if (!slug) return { error: "Missing product." };

  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("slug", slug);
  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return ok;
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export async function updateOrderStatus(formData: FormData): Promise<ActionResult> {
  const denied = await assertAdmin();
  if (denied) return { error: denied };

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const paymentStatus = String(formData.get("payment_status") ?? "");

  if (!id) return { error: "Missing order." };
  if (!["processing", "shipped", "delivered", "cancelled"].includes(status)) {
    return { error: "Invalid order status." };
  }
  if (!["pending", "paid", "failed", "refunded"].includes(paymentStatus)) {
    return { error: "Invalid payment status." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({
      status: status as "processing" | "shipped" | "delivered" | "cancelled",
      payment_status: paymentStatus as "pending" | "paid" | "failed" | "refunded",
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
  return ok;
}

function budgetTier(price: number): "under-100" | "100-300" | "300-600" | "600-plus" {
  if (price < 100) return "under-100";
  if (price < 300) return "100-300";
  if (price < 600) return "300-600";
  return "600-plus";
}
