/**
 * Canonical site origin. Open Graph images must be absolute URLs — WhatsApp,
 * Facebook and X all reject relative paths — so everything that builds a share
 * URL or an og:image resolves through here.
 *
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://sampradagifts.com).
 * Vercel provides VERCEL_PROJECT_PRODUCTION_URL automatically on deploys.
 */
export const SITE_URL = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
})();

export const SITE_NAME = "Samprada Gifts";

export const SITE_DESCRIPTION =
  "Premium, tradition-rooted return gifts for weddings, Varalakshmi Vratham, Gruhapravesam, baby showers, and festive celebrations across India.";

/** Turns a possibly-relative image path into an absolute URL for og:image. */
export function absoluteUrl(path: string): string {
  if (!path) return `${SITE_URL}/og-default.jpg`;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Picks the best image to hand a link-preview crawler.
 *
 * Catalog photos are WebP, which WhatsApp renders unreliably — and they're
 * small and portrait, so they'd produce a thumbnail at best. For those we serve
 * the pre-built 1200x630 JPEG card from scripts/generate-og-images.mjs.
 *
 * Cards are named by product slug, so both storage locations resolve to one:
 *   /products/<slug>.webp                              (bundled in the repo)
 *   .../product-images/catalog/<slug>.webp             (Supabase Storage)
 *
 * Admin uploads land under a different prefix with timestamped filenames and
 * have no pre-built card, so they fall through and are used directly.
 */
const CARD_PATTERNS = [
  /^\/products\/(.+)\.webp$/,
  /\/product-images\/catalog\/(.+)\.webp$/,
];

export function ogImageUrl(path: string | undefined): string {
  if (!path) return `${SITE_URL}/og-default.jpg`;

  for (const pattern of CARD_PATTERNS) {
    const match = path.match(pattern);
    if (match) return `${SITE_URL}/og/products/${match[1]}.jpg`;
  }

  return absoluteUrl(path);
}
