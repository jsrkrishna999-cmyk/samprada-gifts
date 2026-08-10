import Image from "next/image";
import type { Metadata } from "next";
import { Gem, HeartHandshake, Leaf, Users } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { categoryHero } from "@/lib/data/images";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind Samprada Gifts — premium, tradition-rooted return gifts.",
};

const stats = [
  { value: "20,000+", label: "Celebrations gifted" },
  { value: "8", label: "Curated collections" },
  { value: "50+", label: "Artisan partners" },
  { value: "4.7★", label: "Average rating" },
];

const values = [
  { icon: Gem, title: "Handpicked craftsmanship", body: "Sourced from artisan partners specializing in Pichwai, Meenakari, and brasswork." },
  { icon: Leaf, title: "Rooted in tradition", body: "Every collection is designed around real Sampradayam rituals and customs." },
  { icon: Users, title: "Built for scale", body: "Consistent quality whether you're ordering 10 pieces or 10,000." },
  { icon: HeartHandshake, title: "Gifted with care", body: "Thoughtful packaging that makes every return gift feel personal." },
];

export default function AboutPage() {
  return (
    <div>
      <div className="border-b border-sandalwood-light/60 bg-ivory py-14 text-center">
        <Container>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">Our story</p>
          <h1 className="mx-auto max-w-2xl text-balance font-serif text-4xl font-semibold text-maroon-900 sm:text-5xl">
            Gifting rooted in tradition, made for today&rsquo;s celebrations.
          </h1>
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft">
            <Image src={categoryHero("gruhapravesam")} alt="A multi-tier brass aarti lamp being lit during a traditional ceremony" fill sizes="50vw" className="object-cover" />
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">Since day one</p>
            <h2 className="font-serif text-3xl font-semibold text-maroon-900">
              Small keepsakes, made to be kept.
            </h2>
            <p className="mt-4 text-brown-700/75">
              Samprada Gifts started with a simple idea: a return gift should
              feel like a piece of the celebration, not an afterthought. We
              work with artisan partners across India to bring Pichwai
              motifs, Meenakari enamel work, and brass craftsmanship into
              everyday, giftable pieces.
            </p>
            <p className="mt-4 text-brown-700/75">
              Every collection is priced for gifting at scale, from ₹89
              festival favors to curated wedding hampers, without giving up
              on detail or finish.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 rounded-2xl bg-maroon-900 p-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-serif text-3xl font-semibold text-gold-light sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs text-ivory/70">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <SectionHeading eyebrow="What guides us" title="Our Values" align="center" className="mx-auto" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-sandalwood-light bg-ivory p-6 text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-cream text-maroon-600">
                  <v.icon size={22} strokeWidth={1.6} />
                </div>
                <h3 className="font-serif text-lg text-maroon-900">{v.title}</h3>
                <p className="mt-2 text-sm text-brown-700/70">{v.body}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-12 max-w-lg rounded-xl border border-dashed border-sandalwood-light bg-ivory px-5 py-4 text-center text-xs text-brown-700/60">
          This is placeholder brand copy — swap it out with your real company
          story, founding year, and team details before launch.
        </p>
      </Container>
    </div>
  );
}
