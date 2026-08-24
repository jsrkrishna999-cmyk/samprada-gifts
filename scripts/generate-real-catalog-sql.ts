/**
 * Generates supabase/real-catalog.sql from the product photos + rows extracted
 * out of the "PRODUCTS LIST" Google Sheet.
 *
 * Input:  scripts/data/real-products.json  (name, code, slug, price, image file)
 * Output: supabase/real-catalog.sql
 *
 * Prices from the sheet are SUPPLIER COST prices, not retail. They are written
 * to the private product_costs table only — never to products.price, which
 * stays null until real retail prices are supplied.
 *
 * Run: npx tsx scripts/generate-real-catalog-sql.ts
 */

import { readFileSync, writeFileSync } from "node:fs";

interface SourceRow {
  code: string;
  name: string;
  slug: string;
  price: number | null;
  file: string;
}

const rows: SourceRow[] = JSON.parse(
  readFileSync(new URL("./data/real-products.json", import.meta.url), "utf8")
);

// ---------------------------------------------------------------------------
// Categories for the real inventory. Kept separate from the demo categories so
// the two catalogs stay visually distinct until the demo rows are retired.
// ---------------------------------------------------------------------------

interface CategoryDef {
  id: string;
  slug: string;
  name: string;
  description: string;
}

const REAL_CATEGORIES: CategoryDef[] = [
  {
    id: "cat-deity-favors",
    slug: "deity-favors",
    name: "Deity Favors",
    description: "Ganesh, Krishna, Lakshmi and Om keepsakes for pooja and festive gifting.",
  },
  {
    id: "cat-hanging-favors",
    slug: "hanging-favors",
    name: "Hanging Favors",
    description: "Leaf, lotus, flower and butterfly hangers finished with ribbon detailing.",
  },
  {
    id: "cat-animal-motifs",
    slug: "animal-motifs",
    name: "Animal & Bird Favors",
    description: "Cow, elephant and peacock motif favors in hand-painted MDF.",
  },
  {
    id: "cat-jute-bags",
    slug: "jute-bags",
    name: "Jute Bags & Pouches",
    description: "Jute bags, bottle bags, and baskets sized for return-gift packing.",
  },
  {
    id: "cat-thamboolam-sets",
    slug: "thamboolam-sets",
    name: "Thamboolam Sets",
    description: "Assembled thamboolam sets and blouse-piece bags for traditional occasions.",
  },
  {
    id: "cat-dolls",
    slug: "dolls",
    name: "Dolls",
    description: "Cotton and MDF dolls, including Lakshmi dolls for golu and festive display.",
  },
];

// Product code -> category slug. Explicit per product so nothing is guessed by
// substring matching, which would misfile e.g. "Kalusham_bags" as a deity item.
const CATEGORY_BY_CODE: Record<string, string> = {
  // Deity favors
  C028: "deity-favors", C031: "deity-favors", C036: "deity-favors",
  C037: "deity-favors", C029: "deity-favors", C032: "deity-favors",
  C044: "deity-favors", C045: "deity-favors", C046: "deity-favors",
  C047: "deity-favors", C049: "deity-favors", C051: "deity-favors",
  C040: "deity-favors", C035: "deity-favors", C030: "deity-favors",
  C033: "deity-favors", C034: "deity-favors", C038: "deity-favors",
  C043: "deity-favors",
  // Hanging favors
  C001: "hanging-favors", C015: "hanging-favors", C016: "hanging-favors",
  C004: "hanging-favors", C014: "hanging-favors", C018: "hanging-favors",
  C058: "hanging-favors", C007: "hanging-favors", C017: "hanging-favors",
  C019: "hanging-favors", C054: "hanging-favors", C006: "hanging-favors",
  C008: "hanging-favors", C052: "hanging-favors", C005: "hanging-favors",
  // Animal & bird
  C048: "animal-motifs", C050: "animal-motifs", C023: "animal-motifs",
  C024: "animal-motifs", C025: "animal-motifs",
  // Jute bags & pouches
  C002: "jute-bags", C020: "jute-bags", C003: "jute-bags",
  C042: "jute-bags", C021: "jute-bags", C039: "jute-bags",
  // Thamboolam
  C057: "thamboolam-sets", C055: "thamboolam-sets",
  C056: "thamboolam-sets", C053: "thamboolam-sets",
  // Dolls
  C009: "dolls", C010: "dolls", C011: "dolls", C012: "dolls", C027: "dolls",
};

const CATEGORY_NOUN: Record<string, string> = {
  "deity-favors": "deity favor",
  "hanging-favors": "hanging favor",
  "animal-motifs": "motif favor",
  "jute-bags": "jute bag",
  "thamboolam-sets": "thamboolam set",
  dolls: "doll",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ACRONYMS: Record<string, string> = { om: "Om", mdf: "MDF" };

/** "COlour_Ganesh" -> "Colour Ganesh", "balaGanesh1" -> "Bala Ganesh 1" */
function displayName(raw: string): string {
  return raw
    .trim()
    .replace(/[_-]+/g, " ")
    // split camelCase / letter-digit boundaries
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => {
      const lower = word.toLowerCase();
      if (ACRONYMS[lower]) return ACRONYMS[lower];
      if (/^\d+$/.test(word)) return word;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ")
    .replace(/\bThambulam\b/g, "Thamboolam")
    .replace(/\bKalusham\b/g, "Kalasham")
    .replace(/\bLaxmi\b/g, "Lakshmi");
}

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlTextArray(values: string[]): string {
  if (values.length === 0) return "'{}'";
  return `ARRAY[${values.map(sqlString).join(", ")}]`;
}

function sqlNullableNumber(value: number | null): string {
  return value == null ? "null" : String(value);
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

const lines: string[] = [];

lines.push("-- Real Samprada Gifts catalog, generated from the PRODUCTS LIST sheet.");
lines.push("-- Generated by scripts/generate-real-catalog-sql.ts — do not edit by hand.");
lines.push("--");
lines.push("-- Prerequisites: schema.sql, then migrations/002_real_catalog.sql.");
lines.push("-- Re-running this file replaces the real catalog and leaves demo rows alone.");
lines.push("");
lines.push("begin;");
lines.push("");
lines.push("-- Clear only previously-imported real rows, never the demo catalog.");
lines.push("delete from products where source = 'catalog';");
lines.push(
  `delete from categories where slug in (${REAL_CATEGORIES.map((c) => sqlString(c.slug)).join(", ")});`
);
lines.push("");

// Categories
lines.push("-- Categories -----------------------------------------------------------");
const counts = new Map<string, number>();
for (const row of rows) {
  const cat = CATEGORY_BY_CODE[row.code];
  if (!cat) throw new Error(`No category mapped for ${row.code} (${row.name})`);
  counts.set(cat, (counts.get(cat) ?? 0) + 1);
}

for (const cat of REAL_CATEGORIES) {
  const count = counts.get(cat.slug) ?? 0;
  if (count === 0) throw new Error(`Category ${cat.slug} has no products`);
  // Hero image: first product photo in that category.
  const hero = rows.find((r) => CATEGORY_BY_CODE[r.code] === cat.slug)!;
  lines.push(
    `insert into categories (id, slug, name, description, image_url, product_count) values (` +
      `${sqlString(cat.id)}, ${sqlString(cat.slug)}, ${sqlString(cat.name)}, ` +
      `${sqlString(cat.description)}, ${sqlString(hero.file)}, ${count});`
  );
}
lines.push("");

// Products
lines.push("-- Products -------------------------------------------------------------");
const costs: string[] = [];

for (const row of rows) {
  const categorySlug = CATEGORY_BY_CODE[row.code];
  const name = displayName(row.name);
  const slug = row.slug;
  const noun = CATEGORY_NOUN[categorySlug];
  const status = row.price == null ? "coming_soon" : "price_on_request";

  const tagline =
    status === "coming_soon"
      ? `${name} — coming soon`
      : `Handcrafted ${noun} · price on request`;

  const description =
    `${name} is a handcrafted ${noun} from the Samprada Gifts collection ` +
    `(product code ${row.code}). ` +
    (status === "coming_soon"
      ? "This piece is not yet available to order — get in touch to be notified when it launches."
      : "Contact us for current pricing, bulk rates, and customisation options.");

  const highlights = [
    "Handcrafted finish",
    "Available for bulk return-gift orders",
    "Customisation and printed tags available on request",
  ];

  lines.push(
    `insert into products (id, slug, name, tagline, category_slug, price, mrp, ` +
      `rating, review_count, images, badges, min_qty, description, highlights, ` +
      `specifications, packaging, shipping, budget_tier, status, source) values (` +
      `${sqlString(`prod-${slug}`)}, ${sqlString(slug)}, ${sqlString(name)}, ` +
      `${sqlString(tagline)}, ${sqlString(categorySlug)}, null, null, ` +
      `0, 0, ${sqlTextArray([row.file])}, '{}', 1, ${sqlString(description)}, ` +
      `${sqlTextArray(highlights)}, '[]'::jsonb, '{}', '{}', null, ` +
      `${sqlString(status)}, 'catalog');`
  );

  costs.push(
    `insert into product_costs (product_slug, product_code, cost_price) values (` +
      `${sqlString(slug)}, ${sqlString(row.code)}, ${sqlNullableNumber(row.price)}) ` +
      `on conflict (product_slug) do update set ` +
      `cost_price = excluded.cost_price, updated_at = now();`
  );
}

lines.push("");
lines.push("-- Supplier cost prices (PRIVATE — product_costs has no public read policy)");
lines.push(...costs);
lines.push("");
lines.push("commit;");
lines.push("");

writeFileSync(new URL("../supabase/real-catalog.sql", import.meta.url), lines.join("\n"));

const priced = rows.filter((r) => r.price != null).length;
console.log(`Wrote supabase/real-catalog.sql`);
console.log(`  categories: ${REAL_CATEGORIES.length}`);
console.log(`  products:   ${rows.length} (${priced} price_on_request, ${rows.length - priced} coming_soon)`);
for (const cat of REAL_CATEGORIES) {
  console.log(`    ${cat.slug.padEnd(18)} ${counts.get(cat.slug)}`);
}
