import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProductListing } from "@/components/shop/ProductListing";
import { getCategoryBySlug } from "@/lib/supabase/queries";
import { ogImageUrl, SITE_NAME, SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category" };

  const url = `${SITE_URL}/category/${category.slug}`;
  const image = ogImageUrl(category.image);

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: `${category.name} — Return Gifts`,
      description: category.description,
      images: [{ url: image, alt: category.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} — Return Gifts`,
      description: category.description,
      images: [image],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <div>
      <div className="relative flex h-64 items-end overflow-hidden sm:h-80">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-700/90 via-brown-700/40 to-brown-700/10" />
        <Container className="relative pb-8 text-ivory">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
            Category
          </p>
          <h1 className="font-serif text-3xl font-semibold sm:text-5xl">{category.name}</h1>
          <p className="mt-2 max-w-xl text-sm text-ivory/70 sm:text-base">{category.description}</p>
        </Container>
      </div>
      <Suspense>
        <ProductListing initialCategory={category.slug} />
      </Suspense>
    </div>
  );
}
