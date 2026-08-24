/**
 * Imports the "Siva" photo batch (60 WhatsApp JPEGs) into the catalog.
 *
 * The source filenames (IMG-20260513-WA00xx.jpg) carry no product information,
 * so names below were written by reading each photo. They are first-pass and
 * meant to be edited — in the admin panel, or here followed by a re-run.
 *
 * Outputs:
 *   public/products/<slug>.webp      optimised storefront images
 *   supabase/siva-catalog.sql        categories + products + cost placeholders
 *
 * Run: node scripts/import-siva-batch.mjs
 */

import sharp from "sharp";
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC =
  "/private/tmp/claude-501/-Users-localaitv-Documents-sampradaya-gifts/5fbbc1ca-ff12-4650-b679-17b361d33a9d/scratchpad/siva/Siva";
const ROOT = new URL("..", import.meta.url).pathname;
const OUT_IMG = join(ROOT, "public/products");

// Marks this import batch so re-running only replaces its own rows and never
// touches the demo catalog or the earlier sheet import.
const SOURCE = "catalog-siva";

const HK = "haldi-kumkum-favors";
const HANG = "hanging-favors";
const THAM = "thamboolam-sets";

/** index (1-based, matching the numbered contact sheets) -> name + category */
const ITEMS = [
  ["Rose Bud Leaf Favor", HANG],
  ["Gold Leaf Rose Favor", HANG],
  ["Mini Gift Bag Favor", HANG],
  ["Gold Peacock Charm Favor", HANG],
  ["Peacock Rose Hanging Favor", HANG],
  ["Gold Butterfly Rose Favor", HANG],
  ["Butterfly Rose Brooch Favor", HANG],
  ["Pink Ganesh Rose Favor", HANG],
  ["Gold Kalasham Rose Favor", HANG],
  ["Filigree Butterfly Favor", HANG],
  ["Thamboolam Tray Set", THAM],
  ["Seemantham Mother Haldi Kumkum Favor", HK],
  ["Conch Ganesh Haldi Kumkum Favor", HK],
  ["Expecting Couple Haldi Kumkum Favor", HK],
  ["Lotus Ganesh Haldi Kumkum Favor", HK],
  ["Mother-to-Be Haldi Kumkum Favor", HK],
  ["Sacred Cow Haldi Kumkum Favor", HK],
  ["Bride Haldi Kumkum Favor", HK],
  ["White Ganesh Haldi Kumkum Favor", HK],
  ["Yashoda Krishna Haldi Kumkum Favor", HK],
  ["Cow and Calf Haldi Kumkum Favor", HK],
  ["Upanayanam Boy Haldi Kumkum Favor", HK],
  ["Balaji Haldi Kumkum Favor", HK],
  ["Traditional Couple Haldi Kumkum Favor", HK],
  ["Bharatanatyam Dancer Haldi Kumkum Favor", HK],
  ["Satyanarayana Swamy Haldi Kumkum Favor", HK],
  ["Kerala Wedding Couple Haldi Kumkum Favor", HK],
  ["Peacock Feather Haldi Kumkum Favor", HK],
  ["Krishna with Cow Haldi Kumkum Favor", HK],
  ["Devi Mukham Haldi Kumkum Favor", HK],
  ["Seemantham Blessing Haldi Kumkum Favor", HK],
  ["Krishna Mukham Haldi Kumkum Favor", HK],
  ["Lakshmi on Lotus Haldi Kumkum Favor", HK],
  ["Amman Face Haldi Kumkum Favor", HK],
  ["Wedding Couple Haldi Kumkum Favor", HK],
  ["Jagannath Haldi Kumkum Favor", HK],
  ["Folk Couple Haldi Kumkum Favor", HK],
  ["Painted Oval Haldi Kumkum Favor", HK],
  ["Cartoon Couple Haldi Kumkum Favor", HK],
  ["Royal Elephant Haldi Kumkum Favor", HK],
  ["Tirumala Namam Haldi Kumkum Favor", HK],
  ["Butter Krishna Haldi Kumkum Favor", HK],
  ["Radha Krishna Haldi Kumkum Favor", HK],
  ["Murugan Haldi Kumkum Favor", HK],
  ["Pink Lotus Haldi Kumkum Favor", HK],
  ["Modern Wedding Couple Haldi Kumkum Favor", HK],
  ["Hanuman Haldi Kumkum Favor", HK],
  ["Vatapatrasai Krishna Haldi Kumkum Favor", HK],
  ["Traditional Lady Haldi Kumkum Favor", HK],
  ["Folk Krishna Haldi Kumkum Favor", HK],
  ["Kalasham Haldi Kumkum Favor", HK],
  ["Gauri Mukham Haldi Kumkum Favor", HK],
  ["Bridal Portrait Haldi Kumkum Favor", HK],
  ["Lehenga Lady Haldi Kumkum Favor", HK],
  ["Radha Krishna Pair Haldi Kumkum Favor", HK],
  ["Baby Ganesh Haldi Kumkum Favor", HK],
  ["Seated Wedding Couple Haldi Kumkum Favor", HK],
  ["Village Lady Haldi Kumkum Favor", HK],
  ["Krishna with Butter Pot Haldi Kumkum Favor", HK],
  ["Purple Lotus Haldi Kumkum Favor", HK],
];

const NEW_CATEGORY = {
  id: "cat-haldi-kumkum-favors",
  slug: HK,
  name: "Haldi Kumkum Favors",
  description:
    "Printed MDF hangers with haldi and kumkum bottles attached — ready to hand to guests.",
};

const NOUN = {
  [HK]: "haldi kumkum favor",
  [HANG]: "hanging favor",
  [THAM]: "thamboolam set",
};

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
const sql = (v) => `'${String(v).replace(/'/g, "''")}'`;
const sqlArr = (a) => (a.length ? `ARRAY[${a.map(sql).join(", ")}]` : "'{}'");

const files = readdirSync(SRC).filter((f) => /\.jpe?g$/i.test(f)).sort();
if (files.length !== ITEMS.length) {
  throw new Error(`Expected ${ITEMS.length} photos, found ${files.length}`);
}

mkdirSync(OUT_IMG, { recursive: true });

const rows = [];
for (let i = 0; i < files.length; i++) {
  const [name, category] = ITEMS[i];
  const code = `SV${String(i + 1).padStart(3, "0")}`;
  const slug = `${slugify(name)}-${code.toLowerCase()}`;

  await sharp(join(SRC, files[i]))
    .resize(1000, 1000, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(OUT_IMG, `${slug}.webp`));

  rows.push({ code, name, slug, category, file: `/products/${slug}.webp`, src: files[i] });
}

// ---------------------------------------------------------------------------
// SQL
// ---------------------------------------------------------------------------
const lines = [];
lines.push("-- Siva photo batch — generated by scripts/import-siva-batch.mjs.");
lines.push("-- Prerequisites: schema.sql, migrations/002, migrations/003.");
lines.push("-- Re-running replaces only this batch; demo and sheet products are untouched.");
lines.push("");
lines.push("begin;");
lines.push("");
lines.push(`delete from products where source = ${sql(SOURCE)};`);
lines.push("");

const hkCount = rows.filter((r) => r.category === HK).length;
const hero = rows.find((r) => r.category === HK);
lines.push("-- New category for this line -------------------------------------------");
lines.push(
  `insert into categories (id, slug, name, description, image_url, product_count) values (` +
    `${sql(NEW_CATEGORY.id)}, ${sql(NEW_CATEGORY.slug)}, ${sql(NEW_CATEGORY.name)}, ` +
    `${sql(NEW_CATEGORY.description)}, ${sql(hero.file)}, ${hkCount}) ` +
    `on conflict (slug) do update set description = excluded.description, ` +
    `image_url = excluded.image_url, product_count = excluded.product_count;`
);
lines.push("");
lines.push("-- Products ---------------------------------------------------------------");

const highlights = [
  "Handcrafted finish",
  "Available for bulk return-gift orders",
  "Customisation and printed tags available on request",
];

for (const r of rows) {
  const noun = NOUN[r.category];
  const withBottles = r.category === HK;
  const tagline = withBottles
    ? "With haldi & kumkum bottles · price on request"
    : `Handcrafted ${noun} · price on request`;
  const description =
    `${r.name} is a handcrafted ${noun} from the Samprada Gifts collection ` +
    `(product code ${r.code}). ` +
    (withBottles ? "Supplied with haldi and kumkum bottles attached. " : "") +
    "Contact us for current pricing, bulk rates, and customisation options.";

  lines.push(
    `insert into products (id, slug, name, tagline, category_slug, price, mrp, rating, ` +
      `review_count, images, badges, min_qty, description, highlights, specifications, ` +
      `packaging, shipping, budget_tier, status, source) values (` +
      `${sql(`prod-${r.slug}`)}, ${sql(r.slug)}, ${sql(r.name)}, ${sql(tagline)}, ` +
      `${sql(r.category)}, null, null, 0, 0, ${sqlArr([r.file])}, '{}', 1, ` +
      `${sql(description)}, ${sqlArr(highlights)}, '[]'::jsonb, '{}', '{}', null, ` +
      `'price_on_request', ${sql(SOURCE)});`
  );
}

lines.push("");
lines.push("-- Cost placeholders (PRIVATE — fill in from your supplier sheet)");
for (const r of rows) {
  lines.push(
    `insert into product_costs (product_slug, product_code, cost_price) values (` +
      `${sql(r.slug)}, ${sql(r.code)}, null) on conflict (product_slug) do nothing;`
  );
}

lines.push("");
lines.push("-- Keep the reused categories' counts honest.");
lines.push(
  `update categories c set product_count = (select count(*) from products p where p.category_slug = c.slug);`
);
lines.push("");
lines.push("commit;");
lines.push("");

writeFileSync(join(ROOT, "supabase/siva-catalog.sql"), lines.join("\n"));
mkdirSync(join(ROOT, "scripts/data"), { recursive: true });
writeFileSync(join(ROOT, "scripts/data/siva-products.json"), JSON.stringify(rows, null, 1));

const byCat = rows.reduce((m, r) => ((m[r.category] = (m[r.category] ?? 0) + 1), m), {});
console.log(`Imported ${rows.length} products`);
for (const [c, n] of Object.entries(byCat)) console.log(`  ${c.padEnd(22)} ${n}`);
console.log("Wrote supabase/siva-catalog.sql");
