import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductTabs } from "@/components/product/ProductTabs";
import { FrequentlyBoughtTogether } from "@/components/product/FrequentlyBoughtTogether";
import { ProductGridSection } from "@/components/ProductGridSection";
import {
  getProductBySlug,
  getRelatedProducts,
  getFrequentlyBoughtWith,
  getCategoryBySlug,
} from "@/lib/supabase/queries";
import { ogImageUrl, SITE_NAME, SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };

  const url = `${SITE_URL}/product/${product.slug}`;
  // Prefer the tagline, but fall back to the description so a shared link is
  // never a bare title with no context.
  const description = product.tagline || product.description.slice(0, 160);
  const image = ogImageUrl(product.images[0]);
  const priceLine =
    product.price != null ? `${product.name} — ₹${product.price}` : product.name;

  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: priceLine,
      description,
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: priceLine,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, related, fbt] = await Promise.all([
    getCategoryBySlug(product.categorySlug),
    getRelatedProducts(product, 4),
    getFrequentlyBoughtWith(product, 2),
  ]);

  return (
    <div className="pb-24">
      <Container className="pt-6">
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-brown-700/50">
          <Link href="/" className="hover:text-maroon-600">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-maroon-600">Shop</Link>
          {category && (
            <>
              <ChevronRight size={12} />
              <Link href={`/category/${category.slug}`} className="hover:text-maroon-600">
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-brown-700/80">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} name={product.name} />
          <ProductPurchasePanel product={product} />
        </div>

        <ProductTabs product={product} />

        <div className="mt-10">
          <FrequentlyBoughtTogether main={product} suggestions={fbt} />
        </div>
      </Container>

      {related.length > 0 && (
        <ProductGridSection
          eyebrow={category?.name ?? "More to explore"}
          title="Related Products"
          products={related}
          columns={4}
          tinted
        />
      )}
    </div>
  );
}
