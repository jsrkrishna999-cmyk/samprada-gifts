import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/Container";
import { categoryHero } from "@/lib/data/images";
import { InstagramIcon } from "@/components/icons/SocialIcons";

const gallery = [
  categoryHero("haldi-kumkum"),
  categoryHero("wedding"),
  categoryHero("gruhapravesam"),
  categoryHero("diwali"),
  categoryHero("varalakshmi-vratham"),
  categoryHero("baby-shower"),
];

export function InstagramGallery() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="@sampradagifts"
          title="Follow along on Instagram"
          align="center"
          className="mx-auto"
        />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
          {gallery.map((src, i) => (
            <a
              key={i}
              href="#"
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <Image
                src={src}
                alt="Samprada Gifts on Instagram"
                fill
                sizes="16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-maroon-900/0 transition-colors group-hover:bg-maroon-900/40">
                <InstagramIcon className="text-ivory opacity-0 transition-opacity group-hover:opacity-100" width={20} height={20} />
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
