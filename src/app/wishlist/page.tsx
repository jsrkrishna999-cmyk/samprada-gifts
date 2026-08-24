"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, HeartPlus } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Button, LinkButton } from "@/components/ui/Button";
import { ShareButton } from "@/components/ui/ShareButton";
import { ProductCard } from "@/components/ProductCard";
import { useWishlist } from "@/context/wishlist-context";
import { useCatalog } from "@/context/catalog-context";
import { useToast } from "@/context/toast-context";

export default function WishlistPage() {
  return (
    <Suspense>
      <WishlistView />
    </Suspense>
  );
}

function WishlistView() {
  const searchParams = useSearchParams();
  const { slugs, toggle, has } = useWishlist();
  const { getProductBySlug, loading } = useCatalog();
  const { show } = useToast();

  // A ?items= list means this is someone else's shared shortlist, viewed by a
  // person who may have their own wishlist. Show theirs read-only rather than
  // silently merging into, or overwriting, the viewer's own saved items.
  const sharedParam = searchParams.get("items");
  const isShared = !!sharedParam;
  const sharedSlugs = sharedParam
    ? sharedParam.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const activeSlugs = isShared ? sharedSlugs : slugs;
  const products = activeSlugs.map((s) => getProductBySlug(s)).filter(Boolean);

  function saveAll() {
    let added = 0;
    for (const slug of sharedSlugs) {
      if (!has(slug)) {
        toggle(slug);
        added += 1;
      }
    }
    show(
      added === 0 ? "All of these are already saved" : `${added} saved to your wishlist`,
      "wishlist"
    );
  }

  if (loading) {
    return (
      <Container className="py-20 text-center text-sm text-brown-700/60">
        Loading…
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container className="flex flex-col items-center justify-center py-28 text-center">
        <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-ivory text-maroon-600">
          <Heart size={30} />
        </div>
        <h1 className="font-serif text-2xl text-maroon-900">
          {isShared ? "This shortlist is empty" : "Your wishlist is empty"}
        </h1>
        <p className="mt-2 max-w-sm text-brown-700/60">
          {isShared
            ? "The products in this link are no longer available."
            : "Tap the heart icon on any product to save it here for later."}
        </p>
        <LinkButton href="/shop" className="mt-6">
          Explore Products
        </LinkButton>
      </Container>
    );
  }

  const shareUrl = `/wishlist?items=${activeSlugs.join(",")}`;

  return (
    <Container className="py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow={isShared ? "Shared with you" : `${products.length} saved`}
          title={isShared ? "A gift shortlist" : "Your Wishlist"}
          className="mb-0"
        />

        {isShared ? (
          <Button onClick={saveAll} variant="outline">
            <HeartPlus size={16} /> Save all to my wishlist
          </Button>
        ) : (
          <ShareButton
            url={shareUrl}
            title="My Samprada Gifts shortlist"
            text={`Which of these should we pick? ${products.length} return gift options from Samprada Gifts`}
            label="Share shortlist"
            variant="button"
          />
        )}
      </div>

      {!isShared && (
        <p className="mb-6 -mt-3 max-w-xl text-sm text-brown-700/60">
          Deciding with family? Share this shortlist and everyone can see the same
          options.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {products.map((p, i) => p && <ProductCard key={p.slug} product={p} index={i} />)}
      </div>
    </Container>
  );
}
