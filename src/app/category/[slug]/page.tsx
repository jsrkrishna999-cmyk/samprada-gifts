import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProductListing } from "@/components/shop/ProductListing";
import { categories, getCategoryBySlug } from "@/lib/data/categories";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  return {
    title: category ? category.name : "Category",
    description: category?.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
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
