"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.07, ease: "easeOut" }}
    >
      <Link
        href={`/category/${category.slug}`}
        className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl shadow-soft transition-shadow duration-300 hover:shadow-lift"
      >
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 90vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-700/85 via-brown-700/10 to-transparent" />
        <div className="relative flex items-center justify-between gap-2 p-4 text-ivory">
          <div>
            <h3 className="font-serif text-lg font-medium">{category.name}</h3>
            <p className="text-xs text-ivory/70">{category.productCount} pieces</p>
          </div>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ivory/15 backdrop-blur transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
