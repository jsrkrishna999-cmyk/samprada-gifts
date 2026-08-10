"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/context/wishlist-context";

export function WishlistButton({
  slug,
  size = "sm",
  variant = "overlay",
  className,
}: {
  slug: string;
  size?: "sm" | "lg";
  variant?: "overlay" | "outline";
  className?: string;
}) {
  const { has, toggle } = useWishlist();
  const wishlisted = has(slug);
  const dims = size === "sm" ? "h-9 w-9" : "h-13 w-13";
  const iconSize = size === "sm" ? 16 : 18;

  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault();
        toggle(slug);
      }}
      whileTap={{ scale: 0.85 }}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={wishlisted}
      className={cn(
        "grid place-items-center rounded-full transition-colors",
        dims,
        variant === "outline" &&
          (wishlisted
            ? "border border-temple-red bg-temple-red/10 text-temple-red"
            : "border border-sandalwood-light text-maroon-600 hover:bg-cream"),
        className
      )}
      style={size === "lg" ? { height: 52, width: 52 } : undefined}
    >
      <motion.span
        key={String(wishlisted)}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        <Heart
          size={iconSize}
          className={cn(wishlisted && "fill-temple-red text-temple-red")}
        />
      </motion.span>
    </motion.button>
  );
}
