import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui/Container";
import { CategoryCard } from "@/components/CategoryCard";
import { getCategories } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Shop by Category",
  description: "Explore Samprada Gifts categories — Haldi Kumkum, Wedding, Diwali, Navaratri, and more.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="py-14">
      <Container>
        <SectionHeading
          eyebrow="Every occasion, covered"
          title="Shop by Category"
          description="Eight curated collections spanning poojas, weddings, and festive gifting."
        />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c, i) => (
            <CategoryCard key={c.slug} category={c} index={i} />
          ))}
        </div>
      </Container>
    </div>
  );
}
