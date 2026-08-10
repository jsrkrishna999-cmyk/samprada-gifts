import { Quote } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { RatingStars } from "@/components/ui/RatingStars";
import { testimonials } from "@/lib/data/testimonials";

export function CustomerReviews() {
  return (
    <section className="bg-ivory py-20">
      <Container>
        <SectionHeading
          eyebrow="Loved across India"
          title="Customer Reviews"
          description="20,000+ celebrations gifted, and counting."
        />
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex w-[300px] shrink-0 snap-start flex-col rounded-2xl border border-sandalwood-light bg-cream p-6 shadow-soft sm:w-[340px]"
            >
              <Quote className="mb-3 text-gold" size={22} />
              <RatingStars rating={t.rating} />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-brown-700/80">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-5 border-t border-sandalwood-light pt-4">
                <p className="font-serif text-sm font-semibold text-maroon-900">{t.author}</p>
                <p className="text-xs text-brown-700/60">
                  {t.location} · {t.occasion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
