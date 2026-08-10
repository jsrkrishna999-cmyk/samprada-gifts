"use client";

import { Heart } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { ProductCard } from "@/components/ProductCard";
import { useWishlist } from "@/context/wishlist-context";
import { getProductBySlug } from "@/lib/data/products";

export default function WishlistPage() {
  const { slugs } = useWishlist();
  const products = slugs.map((s) => getProductBySlug(s)).filter(Boolean);

  if (products.length === 0) {
    return (
      <Container className="flex flex-col items-center justify-center py-28 text-center">
        <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-ivory text-maroon-600">
          <Heart size={30} />
        </div>
        <h1 className="font-serif text-2xl text-maroon-900">Your wishlist is empty</h1>
        <p className="mt-2 max-w-sm text-brown-700/60">
          Tap the heart icon on any product to save it here for later.
        </p>
        <LinkButton href="/shop" className="mt-6">
          Explore Products
        </LinkButton>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <SectionHeading eyebrow={`${products.length} saved`} title="Your Wishlist" className="mb-8" />
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {products.map((p, i) => p && <ProductCard key={p.slug} product={p} index={i} />)}
      </div>
    </Container>
  );
}
