import type { Category } from "@/lib/types";
import { categoryHero } from "./images";

export const categories: Category[] = [
  {
    id: "cat-haldi-kumkum",
    slug: "haldi-kumkum",
    name: "Haldi Kumkum",
    description: "Traditional plates, boxes, and favors for haldi kumkum gatherings.",
    image: categoryHero("haldi-kumkum"),
    productCount: 4,
  },
  {
    id: "cat-varalakshmi",
    slug: "varalakshmi-vratham",
    name: "Varalakshmi Vratham",
    description: "Kalasham sets, blouse-piece favors, and pooja return gifts.",
    image: categoryHero("varalakshmi-vratham"),
    productCount: 4,
  },
  {
    id: "cat-gruhapravesam",
    slug: "gruhapravesam",
    name: "Gruhapravesam",
    description: "Housewarming favors — nilavilakku sets, trays, and keepsakes.",
    image: categoryHero("gruhapravesam"),
    productCount: 4,
  },
  {
    id: "cat-baby-shower",
    slug: "baby-shower",
    name: "Baby Shower",
    description: "Playful, pastel-toned favors for seemantham and baby showers.",
    image: categoryHero("baby-shower"),
    productCount: 4,
  },
  {
    id: "cat-wedding",
    slug: "wedding",
    name: "Wedding",
    description: "Potlis, dry fruit boxes, and premium hampers for wedding guests.",
    image: categoryHero("wedding"),
    productCount: 4,
  },
  {
    id: "cat-navaratri",
    slug: "navaratri",
    name: "Navaratri",
    description: "Golu favors, thamboolam sets, and festive bags.",
    image: categoryHero("navaratri"),
    productCount: 4,
  },
  {
    id: "cat-diwali",
    slug: "diwali",
    name: "Diwali",
    description: "Brass diyas, sweet boxes, and festive light-themed hampers.",
    image: categoryHero("diwali"),
    productCount: 4,
  },
  {
    id: "cat-corporate",
    slug: "corporate-gifts",
    name: "Corporate Gifts",
    description: "Elegant bulk hampers for festive corporate gifting.",
    image: categoryHero("corporate-gifts"),
    productCount: 4,
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
