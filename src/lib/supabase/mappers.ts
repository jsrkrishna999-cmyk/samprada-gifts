// Shared row -> app-shape mappers, used by both the server-side query
// layer (queries.ts) and the client-side catalog cache (catalog-context.tsx),
// so a Product/Category always looks the same to the UI regardless of
// whether it was fetched on the server or in the browser.

import type { Category, Product, ProductSpec, Review } from "@/lib/types";
import type { Database } from "./types";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

export function rowToCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    image: row.image_url,
    productCount: row.product_count,
  };
}

export function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    author: row.author,
    rating: row.rating,
    date: row.review_date,
    title: row.title,
    body: row.body,
    verified: row.verified,
  };
}

export function rowToProduct(row: ProductRow, reviewRows: ReviewRow[] = []): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    categorySlug: row.category_slug,
    price: row.price,
    mrp: row.mrp,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    images: row.images,
    badges: row.badges as Product["badges"],
    minQty: row.min_qty,
    description: row.description,
    highlights: row.highlights,
    specifications: row.specifications as unknown as ProductSpec[],
    packaging: row.packaging,
    shipping: row.shipping,
    reviews: reviewRows.map(rowToReview),
    budgetTier: row.budget_tier as Product["budgetTier"],
    status: row.status ?? "active",
  };
}

export function rowsToProducts(productRows: ProductRow[], reviewRows: ReviewRow[]): Product[] {
  const reviewsBySlug = new Map<string, ReviewRow[]>();
  for (const r of reviewRows) {
    const list = reviewsBySlug.get(r.product_slug) ?? [];
    list.push(r);
    reviewsBySlug.set(r.product_slug, list);
  }
  return productRows.map((row) => rowToProduct(row, reviewsBySlug.get(row.slug) ?? []));
}
