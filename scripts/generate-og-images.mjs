/**
 * Builds a 1200x630 JPEG share card for every local product photo.
 *
 * Two reasons this exists rather than pointing og:image straight at the .webp:
 *  1. WhatsApp — the dominant sharing channel for this store — renders WebP
 *     link previews unreliably, so shares silently lose their image.
 *  2. The source photos are small and portrait (some ~194x259). Social cards
 *     want 1200x630 landscape; anything smaller gets a tiny thumbnail or none.
 *
 * Run: node scripts/generate-og-images.mjs
 */

import sharp from "sharp";
import { readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "public/products");
const OUT = join(ROOT, "public/og/products");

const W = 1200;
const H = 630;
const MAROON = { r: 0x7a, g: 0x1f, b: 0x38 };

mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter((f) => f.endsWith(".webp"));
let made = 0;

for (const file of files) {
  const base = file.replace(/\.webp$/, "");

  // Product photo, contained in the right-hand two-thirds.
  const photo = await sharp(join(SRC, file))
    .resize(430, 520, { fit: "inside", withoutEnlargement: false })
    .toBuffer();
  const photoMeta = await sharp(photo).metadata();

  // Soft blurred fill so small portrait photos don't sit on dead space.
  const backdrop = await sharp(join(SRC, file))
    .resize(W, H, { fit: "cover" })
    .blur(40)
    .modulate({ brightness: 0.45 })
    .toBuffer();

  const overlay = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <rect width="${W}" height="${H}" fill="rgb(${MAROON.r},${MAROON.g},${MAROON.b})" opacity="0.72"/>
      <rect x="0" y="0" width="${W}" height="8" fill="#C9972F"/>
      <text x="72" y="${H - 96}" font-family="Georgia, serif" font-size="46" font-weight="600" fill="#FFFDF6">Samprada Gifts</text>
      <text x="74" y="${H - 56}" font-family="Helvetica, Arial, sans-serif" font-size="21" letter-spacing="6" fill="#E3C27A">TRADITIONAL RETURN GIFTS</text>
    </svg>`
  );

  await sharp(backdrop)
    .composite([
      { input: overlay, top: 0, left: 0 },
      {
        input: photo,
        top: Math.round((H - (photoMeta.height ?? 520)) / 2) - 30,
        left: Math.round(W - (photoMeta.width ?? 430) - 90),
      },
    ])
    .jpeg({ quality: 86, chromaSubsampling: "4:4:4" })
    .toFile(join(OUT, `${base}.jpg`));

  made += 1;
}

console.log(`Generated ${made} share cards in public/og/products/`);
