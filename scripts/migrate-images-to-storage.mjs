/**
 * Moves bundled catalog photos into Supabase Storage so they can be managed
 * from /admin instead of requiring a code change and redeploy.
 *
 * What it does:
 *   1. Uploads public/products/<slug>.webp -> bucket product-images at
 *      catalog/<slug>.webp
 *   2. Rewrites products.images and categories.image_url to the public URLs
 *
 * Local files are left in place. Nothing references them afterwards, so they
 * can be deleted once you've confirmed the site looks right — keeping them
 * means this is trivially reversible.
 *
 * Requires the SECRET key (writes bypass RLS). It is read from the environment
 * and never committed:
 *
 *   1. Add to .env.local (already git-ignored):
 *        SUPABASE_SECRET_KEY=sb_secret_...
 *   2. Dry run first:
 *        node --env-file=.env.local scripts/migrate-images-to-storage.mjs --dry-run
 *   3. For real:
 *        node --env-file=.env.local scripts/migrate-images-to-storage.mjs
 *
 * Safe to re-run: uploads use upsert and the URL rewrite is idempotent.
 */

import { createClient } from "@supabase/supabase-js";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DRY_RUN = process.argv.includes("--dry-run");

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SECRET = process.env.SUPABASE_SECRET_KEY;

if (!URL_) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL. Run with --env-file=.env.local");
  process.exit(1);
}
if (!SECRET) {
  console.error(
    "Missing SUPABASE_SECRET_KEY.\n" +
      "Add it to .env.local (Supabase dashboard -> Settings -> API -> Secret keys),\n" +
      "then run: node --env-file=.env.local scripts/migrate-images-to-storage.mjs"
  );
  process.exit(1);
}
if (SECRET.startsWith("sb_publishable_")) {
  console.error("That's the publishable key — it can't write. Use the secret key.");
  process.exit(1);
}

const BUCKET = "product-images";
const PREFIX = "catalog";
const ROOT = new URL("..", import.meta.url).pathname;
const LOCAL_DIR = join(ROOT, "public/products");

const supabase = createClient(URL_, SECRET, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const files = readdirSync(LOCAL_DIR).filter((f) => f.endsWith(".webp"));
console.log(`${files.length} local photos${DRY_RUN ? "  (DRY RUN — nothing will change)" : ""}\n`);

// ---------------------------------------------------------------------------
// 1. Upload
// ---------------------------------------------------------------------------
const urlBySlug = new Map();
let uploaded = 0;
let failed = 0;

for (const file of files) {
  const slug = file.replace(/\.webp$/, "");
  const path = `${PREFIX}/${file}`;

  if (!DRY_RUN) {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, readFileSync(join(LOCAL_DIR, file)), {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: true,
      });

    if (error) {
      console.error(`  ✗ ${file}: ${error.message}`);
      failed += 1;
      continue;
    }
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  urlBySlug.set(slug, data.publicUrl);
  uploaded += 1;
  if (uploaded % 20 === 0) console.log(`  uploaded ${uploaded}/${files.length}`);
}

console.log(`\nUploaded ${uploaded}${failed ? `, ${failed} failed` : ""}`);
if (failed) {
  console.error("Stopping before the database rewrite — fix the uploads first.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 2. Rewrite database URLs
// ---------------------------------------------------------------------------
const { data: products, error: readError } = await supabase
  .from("products")
  .select("slug, images");

if (readError) {
  console.error(`Could not read products: ${readError.message}`);
  process.exit(1);
}

/** Swaps any /products/<file>.webp entry for its uploaded URL. */
function remap(images) {
  let changed = false;
  const next = images.map((img) => {
    const match = typeof img === "string" && img.match(/^\/products\/(.+)\.webp$/);
    if (!match) return img;
    const url = urlBySlug.get(match[1]);
    if (!url) return img;
    changed = true;
    return url;
  });
  return changed ? next : null;
}

let productsUpdated = 0;
for (const p of products ?? []) {
  const next = remap(p.images ?? []);
  if (!next) continue;

  if (!DRY_RUN) {
    const { error } = await supabase.from("products").update({ images: next }).eq("slug", p.slug);
    if (error) {
      console.error(`  ✗ ${p.slug}: ${error.message}`);
      continue;
    }
  }
  productsUpdated += 1;
}

const { data: categories } = await supabase.from("categories").select("slug, image_url");
let categoriesUpdated = 0;
for (const c of categories ?? []) {
  const next = remap([c.image_url ?? ""]);
  if (!next) continue;

  if (!DRY_RUN) {
    const { error } = await supabase
      .from("categories")
      .update({ image_url: next[0] })
      .eq("slug", c.slug);
    if (error) {
      console.error(`  ✗ category ${c.slug}: ${error.message}`);
      continue;
    }
  }
  categoriesUpdated += 1;
}

console.log(`Products rewritten:   ${productsUpdated}`);
console.log(`Categories rewritten: ${categoriesUpdated}`);
console.log(
  DRY_RUN
    ? "\nDry run complete. Re-run without --dry-run to apply."
    : "\nDone. Photos are now managed from /admin.\n" +
        "Share cards still work — they're matched by slug, not by storage location."
);
