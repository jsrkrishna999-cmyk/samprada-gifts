// Hand-written to match supabase/schema.sql + migrations/002, 003.
// Once the project is live these can be regenerated from the real database:
//   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
//
// Row shapes are declared standalone and then referenced by the Database map.
//
// They must be `type` aliases, not `interface`s: Supabase constrains each table
// to `Record<string, unknown>`, and an interface has no implicit index
// signature, so using one silently collapses every table type to `never`.

export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  product_count: number;
  created_at: string;
}

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category_slug: string;
  price: number | null;
  mrp: number | null;
  rating: number;
  review_count: number;
  images: string[];
  badges: string[];
  min_qty: number;
  description: string;
  highlights: string[];
  specifications: { label: string; value: string }[];
  packaging: string[];
  shipping: string[];
  budget_tier: string | null;
  status: "active" | "price_on_request" | "coming_soon";
  source: string;
  created_at: string;
}

export type ReviewRow = {
  id: string;
  product_slug: string;
  author: string;
  rating: number;
  review_date: string;
  title: string;
  body: string;
  verified: boolean;
  created_at: string;
}

export type AdminRow = {
  user_id: string;
  email: string;
  created_at: string;
}

export type ProductCostRow = {
  product_slug: string;
  product_code: string;
  cost_price: number | null;
  supplier: string | null;
  notes: string | null;
  updated_at: string;
}

export type OrderRow = {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  payment_method: string;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  subtotal: number;
  discount: number;
  delivery_fee: number;
  total: number;
  coupon_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_slug: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  gift_wrap: boolean;
  line_total: number;
}

/**
 * Columns the database fills in itself on insert — identity columns, timestamps,
 * the order-number trigger, and any column with a DEFAULT. Optional on insert.
 */
type Generated =
  | "id"
  | "created_at"
  | "updated_at"
  | "order_number"
  | "status"
  | "payment_status"
  | "source"
  | "discount"
  | "delivery_fee"
  | "gift_wrap"
  | "verified"
  | "product_count"
  | "review_count"
  | "rating"
  | "min_qty";

type Insertable<T> = Omit<T, Extract<keyof T, Generated>> &
  Partial<Pick<T, Extract<keyof T, Generated>>>;

type Table<Row> = {
  Row: Row;
  Insert: Insertable<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      categories: Table<CategoryRow>;
      products: Table<ProductRow>;
      reviews: Table<ReviewRow>;
      admins: Table<AdminRow>;
      product_costs: Table<ProductCostRow>;
      orders: Table<OrderRow>;
      order_items: Table<OrderItemRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
