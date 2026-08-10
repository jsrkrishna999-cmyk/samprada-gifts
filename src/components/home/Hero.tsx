"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { heroImage } from "@/lib/data/images";

const petals = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  left: `${(i * 9.3) % 100}%`,
  size: 10 + ((i * 5) % 14),
  duration: 14 + ((i * 3) % 10),
  delay: i * 1.6,
}));

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-brown-700">
      <Image
        src={heroImage}
        alt="A traditional Indian home entrance with brass lamps, marigold flowers, and a haldi kumkum plate"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brown-700 via-brown-700/60 to-brown-700/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-brown-700/80 via-transparent to-transparent" />

      {/* Ambient lamp glow */}
      <div className="animate-lamp-glow pointer-events-none absolute bottom-[12%] left-[8%] h-40 w-40 rounded-full bg-gold/50 sm:h-56 sm:w-56" />
      <div
        className="animate-lamp-glow pointer-events-none absolute bottom-[20%] right-[12%] h-28 w-28 rounded-full bg-temple-red/40 sm:h-40 sm:w-40"
        style={{ animationDelay: "1.2s" }}
      />

      {/* Floating petals */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {petals.map((p) => (
          <span
            key={p.id}
            className="animate-float-petal absolute top-0 rounded-full bg-gold-light/70"
            style={{
              left: p.left,
              width: p.size,
              height: p.size * 0.7,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl py-24"
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-light/40 bg-ivory/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold-light backdrop-blur">
            <Sparkles size={13} /> Handpicked gifts from ₹89
          </span>
          <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.08] text-ivory sm:text-6xl lg:text-7xl">
            Return gifts that carry warmth, tradition, and gratitude.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-ivory/75">
            Curated Haldi Kumkum keepsakes, wedding potlis, and festive
            hampers — crafted for celebrations across India, designed for
            modern homes.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <LinkButton href="/shop" size="lg">
              Shop Bestsellers <ArrowRight size={16} />
            </LinkButton>
            <LinkButton href="/categories" variant="outline" size="lg" className="!border-ivory/30 !text-ivory hover:!bg-ivory hover:!text-maroon-900">
              Browse Categories
            </LinkButton>
          </div>
        </motion.div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-ivory/60 sm:flex"
      >
        <span className="text-[11px] uppercase tracking-[0.2em]">Scroll</span>
        <span className="h-8 w-px animate-pulse bg-ivory/40" />
      </motion.div>
    </section>
  );
}
