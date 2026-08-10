import { Container, SectionHeading } from "@/components/ui/Container";
import { Gem, PackageCheck, ShieldCheck, Truck } from "lucide-react";

const points = [
  {
    icon: Gem,
    title: "Handpicked craftsmanship",
    body: "Sourced from artisan partners specializing in Pichwai, Meenakari, and brasswork.",
  },
  {
    icon: PackageCheck,
    title: "Bulk-order ready",
    body: "Consistent quality across orders of 10 or 10,000 — with dedicated support.",
  },
  {
    icon: Truck,
    title: "Reliable, on-time dispatch",
    body: "Coordinated packaging and quick turnaround for wedding and event timelines.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    body: "UPI, cards, net banking, wallets, and COD — protected end to end.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading eyebrow="Why Samprada" title="Why Choose Us" align="center" className="mx-auto" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-sandalwood-light bg-ivory p-6 text-center shadow-soft transition-shadow hover:shadow-lift"
            >
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-cream text-maroon-600">
                <p.icon size={24} strokeWidth={1.6} />
              </div>
              <h3 className="font-serif text-lg font-medium text-maroon-900">{p.title}</h3>
              <p className="mt-2 text-sm text-brown-700/70">{p.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
