import type { Product, ProductSpec, Review } from "@/lib/types";
import { productGallery } from "./images";

function budgetTier(price: number): Product["budgetTier"] {
  if (price < 100) return "under-100";
  if (price < 300) return "100-300";
  if (price < 600) return "300-600";
  return "600-plus";
}

function baseSpecs(material: string, dimensions: string, weight: string): ProductSpec[] {
  return [
    { label: "Material", value: material },
    { label: "Dimensions", value: dimensions },
    { label: "Weight", value: weight },
    { label: "Set contains", value: "1 piece (bulk packs available)" },
    { label: "Care", value: "Wipe clean with a soft, dry cloth" },
  ];
}

const packagingDefault = [
  "Individually wrapped in tissue with a Samprada seal sticker",
  "Packed in a rigid gift box with ribbon closure",
  "Optional printed tag with your family name and occasion",
];

const shippingDefault = [
  "Dispatched within 24-48 hours of order confirmation",
  "Bulk orders (50+) require 5-7 days lead time",
  "Careful, tamper-evident packaging for pan-India delivery",
  "Free shipping on orders above ₹2,500",
];

function reviewSet(seed: number): Review[] {
  const pool: Review[] = [
    {
      id: `rev-${seed}-1`,
      author: "Lakshmi R.",
      rating: 5,
      date: "2 weeks ago",
      title: "Beautifully packaged",
      body: "Every piece looked premium and arrived without a single scratch. Our guests kept asking where we got them.",
      verified: true,
    },
    {
      id: `rev-${seed}-2`,
      author: "Priya S.",
      rating: 4,
      date: "1 month ago",
      title: "Great for bulk orders",
      body: "Ordered 80 pieces for a housewarming. Consistent quality across the batch and dispatched right on time.",
      verified: true,
    },
    {
      id: `rev-${seed}-3`,
      author: "Meena K.",
      rating: 5,
      date: "6 weeks ago",
      title: "Exactly as pictured",
      body: "Loved the finishing and the traditional motifs. Will be ordering again for Navaratri.",
      verified: true,
    },
  ];
  return [pool[seed % 3], pool[(seed + 1) % 3]];
}

interface Seed {
  slug: string;
  name: string;
  tagline: string;
  categorySlug: string;
  price: number;
  mrp: number;
  badges?: Product["badges"];
  description: string;
  highlights: string[];
  material: string;
  dimensions: string;
  weight: string;
}

let seedCounter = 0;
const categoryOffsets: Record<string, number> = {};

function build(s: Seed): Product {
  seedCounter += 1;
  const offset = categoryOffsets[s.categorySlug] ?? 0;
  categoryOffsets[s.categorySlug] = offset + 1;

  return {
    id: `prod-${s.slug}`,
    slug: s.slug,
    name: s.name,
    tagline: s.tagline,
    categorySlug: s.categorySlug,
    price: s.price,
    mrp: s.mrp,
    rating: 4.3 + ((seedCounter % 6) / 10),
    reviewCount: 18 + seedCounter * 7,
    images: productGallery(s.categorySlug, offset),
    badges: s.badges,
    minQty: 1,
    description: s.description,
    highlights: s.highlights,
    specifications: baseSpecs(s.material, s.dimensions, s.weight),
    packaging: packagingDefault,
    shipping: shippingDefault,
    reviews: reviewSet(seedCounter),
    budgetTier: budgetTier(s.price),
  };
}

const seeds: Seed[] = [
  // Haldi Kumkum
  {
    slug: "lotus-haldi-kumkum-plate",
    name: "Lotus Haldi Kumkum Plate",
    tagline: "Hand-painted lotus motif return plate",
    categorySlug: "haldi-kumkum",
    price: 149,
    mrp: 220,
    badges: ["bestseller"],
    description:
      "A compact haldi-kumkum plate finished with a hand-painted lotus motif in antique gold. Sized generously for kumkum, haldi, and a few flower petals — a graceful everyday keepsake for your guests.",
    highlights: ["Hand-painted antique gold motif", "Lightweight, easy to stack for bulk orders", "Comes with a small muslin pouch"],
    material: "Stainless steel with enamel finish",
    dimensions: "4.5 in diameter",
    weight: "80g",
  },
  {
    slug: "kumkum-haldi-box-set",
    name: "Kumkum Haldi Box Set",
    tagline: "Twin compartment box with brass latch",
    categorySlug: "haldi-kumkum",
    price: 219,
    mrp: 299,
    description:
      "A twin-compartment haldi kumkum box with a brass latch closure, designed to be reused as a jewelry or trinket box long after the celebration ends.",
    highlights: ["Reusable beyond the occasion", "Secure brass latch", "Available in 3 colourways"],
    material: "MDF with hand-painted lacquer finish",
    dimensions: "3.2 x 3.2 x 2 in",
    weight: "120g",
  },
  {
    slug: "mini-diya-haldi-favor",
    name: "Mini Diya Haldi Favor",
    tagline: "Brass-finish diya doubling as a favor",
    categorySlug: "haldi-kumkum",
    price: 89,
    mrp: 120,
    badges: ["trending"],
    description:
      "A miniature brass-finish diya sized perfectly as a haldi kumkum return favor — guests can light it that same evening.",
    highlights: ["Doubles as a functional diya", "Budget-friendly for large guest lists", "Sold in sets of 10, 25, or 50"],
    material: "Brass-plated metal",
    dimensions: "2 in diameter",
    weight: "45g",
  },
  {
    slug: "sandalwood-kumkum-tray",
    name: "Sandalwood Kumkum Tray",
    tagline: "Warm-toned tray for pooja essentials",
    categorySlug: "haldi-kumkum",
    price: 349,
    mrp: 450,
    description:
      "A sandalwood-toned tray with raised edges to hold kumkum, haldi, and a few betel leaves — an elevated favor for close family and priority guests.",
    highlights: ["Raised edge keeps contents secure", "Premium finish for VIP guest gifting", "Pairs well with our thamboolam sets"],
    material: "Engineered wood, sandalwood laminate",
    dimensions: "6 x 4 in",
    weight: "180g",
  },

  // Varalakshmi Vratham
  {
    slug: "kalasham-return-gift-set",
    name: "Kalasham Return Gift Set",
    tagline: "Miniature kalasham with coconut motif",
    categorySlug: "varalakshmi-vratham",
    price: 259,
    mrp: 340,
    badges: ["bestseller"],
    description:
      "A miniature decorative kalasham finished in antique gold, a meaningful favor for Varalakshmi Vratham guests to take home as a keepsake.",
    highlights: ["Symbolic kalasham design", "Table-top display piece", "Comes gift-boxed"],
    material: "Metal alloy with gold-tone plating",
    dimensions: "4 in height",
    weight: "160g",
  },
  {
    slug: "blouse-piece-favor-set",
    name: "Blouse Piece Favor Set",
    tagline: "Silk-blend fabric folded as a favor",
    categorySlug: "varalakshmi-vratham",
    price: 179,
    mrp: 230,
    description:
      "A traditional blouse-piece favor in a rich silk-blend fabric, folded and packed with a decorative tag — a timeless choice for vratham return gifts.",
    highlights: ["Traditional silk-blend fabric", "Assorted festive colours", "Individually wrapped"],
    material: "Silk-cotton blend fabric",
    dimensions: "1 meter piece",
    weight: "90g",
  },
  {
    slug: "coconut-motif-trinket-box",
    name: "Coconut Motif Trinket Box",
    tagline: "Hand-carved wooden trinket keepsake",
    categorySlug: "varalakshmi-vratham",
    price: 299,
    mrp: 380,
    description:
      "A hand-carved wooden trinket box with a coconut motif lid, useful long after the vratham as a bangle or jewelry box.",
    highlights: ["Hand-carved detailing", "Multi-purpose keepsake", "Ideal for premium guest gifting"],
    material: "Sheesham wood",
    dimensions: "4 x 3 x 2.5 in",
    weight: "210g",
  },
  {
    slug: "vratham-thamboolam-pouch",
    name: "Vratham Thamboolam Pouch",
    tagline: "Betel leaf, nut, and coin pouch",
    categorySlug: "varalakshmi-vratham",
    price: 129,
    mrp: 170,
    description:
      "A ready-to-fill thamboolam pouch in temple-red brocade, sized for betel leaves, nuts, and a coin — assembled to your specification.",
    highlights: ["Brocade fabric with gold trim", "We can assemble contents on request", "Sold in packs of 10"],
    material: "Brocade fabric, drawstring closure",
    dimensions: "5 x 6 in",
    weight: "35g",
  },

  // Gruhapravesam
  {
    slug: "nilavilakku-favor-set",
    name: "Nilavilakku Favor Set",
    tagline: "Miniature standing lamp keepsake",
    categorySlug: "gruhapravesam",
    price: 399,
    mrp: 520,
    badges: ["bestseller"],
    description:
      "A miniature brass-finish nilavilakku (standing lamp), a graceful housewarming favor that guests can display at their own puja corner.",
    highlights: ["Brass-finish standing lamp", "Comes with a wick and oil sachet", "Elegant table-top scale"],
    material: "Brass-plated metal",
    dimensions: "6 in height",
    weight: "240g",
  },
  {
    slug: "gruhapravesam-tray-set",
    name: "Gruhapravesam Tray Set",
    tagline: "Aarti tray with bell and diya slot",
    categorySlug: "gruhapravesam",
    price: 549,
    mrp: 700,
    description:
      "A compact aarti tray with a fitted bell and diya slot — a functional and symbolic gift for a new home.",
    highlights: ["Functional aarti tray", "Fitted bell included", "Premium tier gift for close family"],
    material: "Stainless steel with brass inlay",
    dimensions: "7 x 7 in",
    weight: "310g",
  },
  {
    slug: "housewarming-keepsake-jar",
    name: "Housewarming Keepsake Jar",
    tagline: "Painted jar for rice or sweets favors",
    categorySlug: "gruhapravesam",
    price: 189,
    mrp: 240,
    description:
      "A hand-painted keepsake jar, perfect filled with a few grains of rice, sweets, or dry fruits as a symbolic gruhapravesam favor.",
    highlights: ["Hand-painted festive motifs", "We can pre-fill with sweets/dry fruits", "Reusable storage jar"],
    material: "Glass with painted ceramic lid",
    dimensions: "3 in diameter, 4 in height",
    weight: "150g",
  },
  {
    slug: "mango-leaf-toran-favor",
    name: "Mango Leaf Toran Favor",
    tagline: "Miniature toran keepsake for guests",
    categorySlug: "gruhapravesam",
    price: 99,
    mrp: 130,
    description:
      "A miniature mango-leaf toran, symbolic of the door hangings used in gruhapravesam ceremonies, packaged as a take-home favor.",
    highlights: ["Symbolic mango-leaf motif", "Lightweight, easy to carry", "Budget-friendly bulk favor"],
    material: "Fabric and bead work",
    dimensions: "8 in length",
    weight: "40g",
  },

  // Baby Shower
  {
    slug: "pastel-baby-shower-favor-box",
    name: "Pastel Baby Shower Favor Box",
    tagline: "Soft pastel box with chocolates",
    categorySlug: "baby-shower",
    price: 159,
    mrp: 210,
    badges: ["new"],
    description:
      "A pastel-toned favor box designed for seemantham and baby showers — pre-filled with chocolates and a personalised tag.",
    highlights: ["Pastel colourways to match your theme", "Pre-filled with chocolates", "Custom name tag available"],
    material: "Rigid board box with satin ribbon",
    dimensions: "3 x 3 x 2 in",
    weight: "110g",
  },
  {
    slug: "baby-shower-bangle-set-favor",
    name: "Baby Shower Bangle Set Favor",
    tagline: "Delicate bangles in a gift pouch",
    categorySlug: "baby-shower",
    price: 229,
    mrp: 300,
    description:
      "A set of delicate bangles packed in an organza pouch — a keepsake favor guests can wear right at the celebration.",
    highlights: ["Assorted pastel colours", "Organza pouch packaging", "Sold in sets of 6 or 12"],
    material: "Lac bangles with metal accents",
    dimensions: "2.6 in diameter",
    weight: "60g",
  },
  {
    slug: "seemantham-thamboolam-set",
    name: "Seemantham Thamboolam Set",
    tagline: "Traditional favor with a modern palette",
    categorySlug: "baby-shower",
    price: 179,
    mrp: 230,
    description:
      "A thamboolam set reimagined in soft baby-shower colours — betel leaves, coconut, and a small toy favor for the little one's celebration.",
    highlights: ["Pastel-themed packaging", "Customisable contents", "Great for large guest lists"],
    material: "Fabric pouch with printed tag",
    dimensions: "5 x 6 in",
    weight: "70g",
  },
  {
    slug: "mini-rattle-favor-box",
    name: "Mini Rattle Favor Box",
    tagline: "Playful rattle-shaped favor box",
    categorySlug: "baby-shower",
    price: 119,
    mrp: 150,
    badges: ["trending"],
    description:
      "A playful rattle-shaped favor box filled with toffees — a fun, budget-friendly return gift for baby shower guests of all ages.",
    highlights: ["Playful rattle silhouette", "Filled with toffees", "Great value for large gatherings"],
    material: "Printed cardstock",
    dimensions: "4 in height",
    weight: "55g",
  },

  // Wedding
  {
    slug: "wedding-potli-bag-gold",
    name: "Wedding Potli Bag — Gold",
    tagline: "Zari-embroidered drawstring potli",
    categorySlug: "wedding",
    price: 149,
    mrp: 190,
    badges: ["bestseller"],
    description:
      "A zari-embroidered potli bag in antique gold, sized for sweets, dry fruits, or a small trinket — a wedding favor guests love to keep.",
    highlights: ["Zari embroidery detailing", "Drawstring closure", "Sold in packs of 10, 25, 50, 100"],
    material: "Brocade fabric with zari thread",
    dimensions: "4 x 5 in",
    weight: "45g",
  },
  {
    slug: "dry-fruit-wedding-box",
    name: "Dry Fruit Wedding Box",
    tagline: "Assorted dry fruits in a rigid box",
    categorySlug: "wedding",
    price: 449,
    mrp: 600,
    description:
      "An elegant rigid box with an assortment of premium dry fruits — a generous, premium-tier wedding return gift.",
    highlights: ["Premium mixed dry fruits", "Rigid, reusable box", "Available in 250g and 500g"],
    material: "Rigid board box with foil lining",
    dimensions: "6 x 4 x 2 in",
    weight: "250g / 500g options",
  },
  {
    slug: "meenakari-jewelry-box",
    name: "Meenakari Jewelry Box",
    tagline: "Enamel-work box for premium favors",
    categorySlug: "wedding",
    price: 379,
    mrp: 480,
    description:
      "A hand-finished meenakari enamel box, richly detailed — reserved for your most special wedding guests.",
    highlights: ["Traditional meenakari enamel work", "Reusable jewelry box", "Premium guest-tier gifting"],
    material: "Metal with enamel (meenakari) work",
    dimensions: "3.5 x 3.5 x 2 in",
    weight: "140g",
  },
  {
    slug: "wedding-hamper-deluxe",
    name: "Wedding Hamper — Deluxe",
    tagline: "Curated multi-item wedding hamper",
    categorySlug: "wedding",
    price: 899,
    mrp: 1200,
    badges: ["limited"],
    description:
      "Our most curated wedding hamper — a Meenakari box, dry fruits, a potli bag, and a scented candle, wrapped as a single premium gift.",
    highlights: ["4-in-1 curated hamper", "Fully customisable contents", "Best suited for close family & VIP guests"],
    material: "Mixed — see individual components",
    dimensions: "10 x 8 x 4 in box",
    weight: "650g",
  },

  // Navaratri
  {
    slug: "golu-doll-favor-set",
    name: "Golu Doll Favor Set",
    tagline: "Miniature golu doll keepsake",
    categorySlug: "navaratri",
    price: 259,
    mrp: 330,
    badges: ["trending"],
    description:
      "A miniature hand-painted golu doll, a cherished Navaratri favor for guests who visit your golu display.",
    highlights: ["Hand-painted terracotta finish", "Collectible keepsake", "Assorted designs available"],
    material: "Terracotta with acrylic paint",
    dimensions: "4 in height",
    weight: "130g",
  },
  {
    slug: "navaratri-thamboolam-set",
    name: "Navaratri Thamboolam Set",
    tagline: "Complete thamboolam with haldi kumkum",
    categorySlug: "navaratri",
    price: 199,
    mrp: 260,
    description:
      "A complete thamboolam set with betel leaves, nut, haldi, kumkum, and a small coin — assembled and ready to gift.",
    highlights: ["Fully assembled, ready to gift", "Traditional brocade pouch", "Sold in packs of 10 or 25"],
    material: "Brocade pouch with printed tag",
    dimensions: "5 x 6 in",
    weight: "65g",
  },
  {
    slug: "kumkum-bharani-set",
    name: "Kumkum Bharani Set",
    tagline: "Set of 3 mini kumkum containers",
    categorySlug: "navaratri",
    price: 179,
    mrp: 230,
    description:
      "A set of three miniature bharani (containers) for kumkum, turmeric, and sandalwood paste — a practical, everyday Navaratri favor.",
    highlights: ["Set of 3 mini containers", "Practical, everyday use", "Hand-painted lids"],
    material: "Brass-plated metal with painted lids",
    dimensions: "1.5 in diameter each",
    weight: "95g (set)",
  },
  {
    slug: "festive-bangle-favor-navaratri",
    name: "Festive Bangle Favor",
    tagline: "Colourful bangles for golu guests",
    categorySlug: "navaratri",
    price: 139,
    mrp: 180,
    description:
      "A colourful bangle set packed in a festive pouch, sized as a light, joyful favor for Navaratri golu guests of all ages.",
    highlights: ["Vibrant festive colourways", "Great for large golu guest lists", "Sold in sets of 6 or 12"],
    material: "Lac bangles",
    dimensions: "2.6 in diameter",
    weight: "55g",
  },

  // Diwali
  {
    slug: "brass-diya-set-of-5",
    name: "Brass Diya Set of 5",
    tagline: "Classic brass diyas for gifting",
    categorySlug: "diwali",
    price: 299,
    mrp: 380,
    badges: ["bestseller"],
    description:
      "A set of five classic brass diyas, hand-finished and ready to light — our most-loved Diwali return gift.",
    highlights: ["Set of 5 brass diyas", "Hand-finished detailing", "Comes in a printed gift box"],
    material: "Solid brass",
    dimensions: "2.5 in diameter each",
    weight: "320g (set)",
  },
  {
    slug: "diwali-sweet-box-assorted",
    name: "Diwali Sweet Box — Assorted",
    tagline: "Traditional sweets in a festive box",
    categorySlug: "diwali",
    price: 399,
    mrp: 520,
    description:
      "An assorted box of traditional Diwali sweets, packed in a festive gold-foiled box — a warm, generous gesture for family and friends.",
    highlights: ["Assorted traditional sweets", "Festive gold-foiled packaging", "Available in 250g, 500g, 1kg"],
    material: "Rigid box with foil lining",
    dimensions: "8 x 6 x 2 in",
    weight: "250g / 500g / 1kg options",
  },
  {
    slug: "lamp-glow-candle-set",
    name: "Lamp Glow Candle Set",
    tagline: "Scented candles in diya silhouettes",
    categorySlug: "diwali",
    price: 249,
    mrp: 320,
    badges: ["new"],
    description:
      "A set of scented candles moulded in diya silhouettes — a modern twist on the traditional Diwali favor.",
    highlights: ["Diya-shaped scented candles", "Set of 4 in festive colours", "Long, even burn time"],
    material: "Soy wax blend",
    dimensions: "2 in diameter each",
    weight: "180g (set)",
  },
  {
    slug: "diwali-hamper-festive-glow",
    name: "Diwali Hamper — Festive Glow",
    tagline: "Diyas, sweets, and candles in one hamper",
    categorySlug: "diwali",
    price: 799,
    mrp: 999,
    badges: ["limited"],
    description:
      "Our signature Diwali hamper — brass diyas, an assorted sweet box, and diya-shaped candles, wrapped together for an unforgettable gift.",
    highlights: ["3-in-1 curated hamper", "Fully gift-wrapped and ready to send", "Ideal for premium client & family gifting"],
    material: "Mixed — see individual components",
    dimensions: "10 x 8 x 4 in box",
    weight: "700g",
  },

  // Corporate Gifts
  {
    slug: "corporate-festive-hamper",
    name: "Corporate Festive Hamper",
    tagline: "Branded hamper for bulk client gifting",
    categorySlug: "corporate-gifts",
    price: 649,
    mrp: 850,
    badges: ["bestseller"],
    description:
      "A refined festive hamper designed for corporate gifting — sweets, dry fruits, and a keepsake diya, with space for your company's branded tag.",
    highlights: ["Custom branded tag/card available", "Consistent quality across large bulk orders", "Dedicated account support for 50+ orders"],
    material: "Mixed — see individual components",
    dimensions: "9 x 7 x 3 in box",
    weight: "480g",
  },
  {
    slug: "desk-diya-corporate-favor",
    name: "Desk Diya Corporate Favor",
    tagline: "Minimal brass diya for office desks",
    categorySlug: "corporate-gifts",
    price: 189,
    mrp: 240,
    description:
      "A minimal brass diya sized for a work desk — a tasteful, understated festive gift for employees and clients alike.",
    highlights: ["Minimal, desk-friendly design", "Bulk pricing for 100+ units", "Custom engraving available on request"],
    material: "Brass-plated metal",
    dimensions: "3 in diameter",
    weight: "90g",
  },
  {
    slug: "premium-dry-fruit-corporate-box",
    name: "Premium Dry Fruit Corporate Box",
    tagline: "Elegant box for large-scale gifting",
    categorySlug: "corporate-gifts",
    price: 549,
    mrp: 700,
    description:
      "A premium dry fruit box in a sleek, brand-neutral design — well suited for large-scale corporate festive gifting programmes.",
    highlights: ["Sleek, brand-neutral packaging", "Available in 250g and 500g", "Volume discounts for 100+ units"],
    material: "Rigid board box with foil lining",
    dimensions: "6 x 4 x 2 in",
    weight: "250g / 500g options",
  },
  {
    slug: "corporate-gift-card-box-set",
    name: "Corporate Gift Card Box Set",
    tagline: "Elegant card + box combo for teams",
    categorySlug: "corporate-gifts",
    price: 249,
    mrp: 320,
    description:
      "A slim gift box paired with a printed festive greeting card — a light, elegant option for gifting across large teams.",
    highlights: ["Includes printed greeting card", "Light and easy to distribute", "Great starter tier for corporate orders"],
    material: "Rigid box with matte finish",
    dimensions: "5 x 3 x 1.5 in",
    weight: "70g",
  },
];

export const products: Product[] = seeds.map(build);

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    .slice(0, limit);
}

export function getFrequentlyBoughtWith(product: Product, limit = 2) {
  return products.filter((p) => p.slug !== product.slug).slice(0, limit);
}

export function getBestsellers(limit = 8) {
  return products.filter((p) => p.badges?.includes("bestseller")).slice(0, limit);
}

export function getTrending(limit = 8) {
  return products.filter((p) => p.badges?.includes("trending") || p.badges?.includes("new")).slice(0, limit);
}

export function getByBudget(tier: Product["budgetTier"]) {
  return products.filter((p) => p.budgetTier === tier);
}
