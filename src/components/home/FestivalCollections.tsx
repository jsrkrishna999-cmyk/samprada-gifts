import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { categoryHero } from "@/lib/data/images";

const festivals = [
  {
    slug: "diwali",
    name: "Diwali Collection",
    tag: "Live now",
    description: "Brass diyas, sweet boxes & festive light hampers.",
    image: categoryHero("diwali"),
  },
  {
    slug: "navaratri",
    name: "Navaratri Golu Favors",
    tag: "Trending",
    description: "Golu dolls, thamboolam sets & bangle favors.",
    image: categoryHero("navaratri"),
  },
  {
    slug: "wedding",
    name: "Wedding Season",
    tag: "Bulk-ready",
    description: "Potlis, dry fruit boxes & Meenakari keepsakes.",
    image: categoryHero("wedding"),
  },
];

export function FestivalCollections() {
  return (
    <section className="bg-maroon-900 py-20">
      <Container>
        <SectionHeading
          eyebrow="Limited-time"
          title="Festival Collections"
          description="Seasonal edits, curated for what's celebrated right now."
          className="[&_h2]:text-ivory [&_p]:text-ivory/60"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {festivals.map((f) => (
            <Link
              key={f.slug}
              href={`/category/${f.slug}`}
              className="group relative flex h-80 flex-col justify-end overflow-hidden rounded-2xl shadow-lift"
            >
              <Image
                src={f.image}
                alt={f.name}
                fill
                sizes="(min-width: 1024px) 33vw, 90vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown-700/90 via-brown-700/30 to-transparent" />
              <div className="relative p-6">
                <span className="mb-3 inline-block rounded-full bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-maroon-900">
                  {f.tag}
                </span>
                <h3 className="font-serif text-2xl font-semibold text-ivory">{f.name}</h3>
                <p className="mt-1.5 text-sm text-ivory/70">{f.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-light">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
