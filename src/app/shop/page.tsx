import { Suspense } from "react";
import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui/Container";
import { ProductListing } from "@/components/shop/ProductListing";

export const metadata: Metadata = {
  title: "Shop All Return Gifts",
  description: "Browse the full Samprada Gifts catalog — filter by category, budget, and more.",
};

export default function ShopPage() {
  return (
    <div>
      <div className="border-b border-sandalwood-light/60 bg-ivory py-10">
        <Container>
          <SectionHeading eyebrow="Full catalog" title="Shop All Return Gifts" className="mb-0" />
        </Container>
      </div>
      <Suspense>
        <ProductListing />
      </Suspense>
    </div>
  );
}
