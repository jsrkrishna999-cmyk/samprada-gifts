import type { Address, Order } from "@/lib/types";

export const mockAddresses: Address[] = [
  {
    id: "addr-1",
    fullName: "Divya Krishnan",
    line1: "12, Lakshmi Nagar 3rd Street",
    line2: "Near Ganesh Temple",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600041",
    phone: "+91 98765 43210",
    isDefault: true,
  },
];

export const mockOrders: Order[] = [
  {
    id: "SG-100482",
    date: "12 Sep 2026",
    status: "delivered",
    items: [
      { productSlug: "brass-diya-set-of-5", quantity: 2, price: 299 },
      { productSlug: "diwali-sweet-box-assorted", quantity: 1, price: 399 },
    ],
    total: 997,
    address: "12, Lakshmi Nagar 3rd Street, Chennai 600041",
    paymentMethod: "UPI",
  },
  {
    id: "SG-100317",
    date: "22 Jul 2026",
    status: "shipped",
    items: [{ productSlug: "wedding-potli-bag-gold", quantity: 50, price: 149 }],
    total: 7450,
    address: "12, Lakshmi Nagar 3rd Street, Chennai 600041",
    paymentMethod: "Net Banking",
  },
  {
    id: "SG-100201",
    date: "03 May 2026",
    status: "processing",
    items: [
      { productSlug: "kalasham-return-gift-set", quantity: 20, price: 259 },
      { productSlug: "vratham-thamboolam-pouch", quantity: 20, price: 129 },
    ],
    total: 7760,
    address: "12, Lakshmi Nagar 3rd Street, Chennai 600041",
    paymentMethod: "Card",
  },
];
