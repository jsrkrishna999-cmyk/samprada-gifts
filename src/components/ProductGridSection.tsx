import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductGridSection({
  eyebrow,
  title,
  description,
  products,
  viewAllHref,
  tinted = false,
  columns = 4,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  products: Product[];
  viewAllHref?: string;
  tinted?: boolean;
  columns?: 3 | 4;
}) {
  return (
    <section className={cn("py-20", tinted && "bg-ivory")}>
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} className="mb-0" />
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon-600 hover:text-maroon-700"
            >
              View all <ArrowRight size={15} />
            </Link>
          )}
        </div>
        <div
          className={cn(
            "grid grid-cols-2 gap-4 sm:gap-5",
            columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          )}
        >
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
