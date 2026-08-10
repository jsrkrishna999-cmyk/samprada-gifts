export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  accent?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  categorySlug: string;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  images: string[];
  badges?: ("bestseller" | "new" | "trending" | "limited")[];
  minQty?: number;
  description: string;
  highlights: string[];
  specifications: ProductSpec[];
  packaging: string[];
  shipping: string[];
  reviews: Review[];
  relatedSlugs?: string[];
  frequentlyBoughtWith?: string[];
  budgetTier: "under-100" | "100-300" | "300-600" | "600-plus";
}

export interface CartItem {
  productSlug: string;
  quantity: number;
  giftWrap?: boolean;
}

export interface Address {
  id: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  items: { productSlug: string; quantity: number; price: number }[];
  total: number;
  address: string;
  paymentMethod: string;
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  rating: number;
  quote: string;
  occasion: string;
}
