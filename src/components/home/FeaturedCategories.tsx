import { Container, SectionHeading } from "@/components/ui/Container";
import { CategoryCard } from "@/components/CategoryCard";
import { categories } from "@/lib/data/categories";

export function FeaturedCategories() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Shop by celebration"
          title="Featured Categories"
          description="From haldi kumkum to corporate Diwali gifting — find favors curated for your occasion."
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c, i) => (
            <CategoryCard key={c.slug} category={c} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
