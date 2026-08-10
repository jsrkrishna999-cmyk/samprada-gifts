import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui/Container";

const tiers = [
  { tier: "under-100", label: "Under ₹100", note: "Light, thoughtful favors", color: "bg-sandalwood-light" },
  { tier: "100-300", label: "₹100 – ₹300", note: "Everyday festive picks", color: "bg-gold-light" },
  { tier: "300-600", label: "₹300 – ₹600", note: "Premium keepsakes", color: "bg-maroon-100" },
  { tier: "600-plus", label: "₹600 & above", note: "Curated hampers", color: "bg-brown" },
];

export function ShopByBudget() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Gift within your budget"
          title="Shop by Budget"
          description="Every price point, thoughtfully curated — from light favors to premium hampers."
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {tiers.map((t) => (
            <Link
              key={t.tier}
              href={`/shop?budget=${t.tier}`}
              className={`group flex flex-col justify-between rounded-2xl ${t.color} p-6 shadow-soft transition-transform hover:-translate-y-1 hover:shadow-lift`}
            >
              <p
                className={`font-serif text-2xl font-semibold ${
                  t.tier === "600-plus" ? "text-ivory" : "text-maroon-900"
                }`}
              >
                {t.label}
              </p>
              <p className={`mt-3 text-sm ${t.tier === "600-plus" ? "text-ivory/70" : "text-brown-700/70"}`}>
                {t.note}
              </p>
              <span
                className={`mt-6 inline-block text-xs font-semibold uppercase tracking-wider ${
                  t.tier === "600-plus" ? "text-gold-light" : "text-maroon-600"
                } transition-transform group-hover:translate-x-1`}
              >
                Shop now →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
