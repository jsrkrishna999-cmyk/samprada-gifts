"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedBadge({
  value,
  tone = "maroon",
}: {
  value: number;
  tone?: "maroon" | "red";
}) {
  return (
    <AnimatePresence>
      {value > 0 && (
        <motion.span
          key={value}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className={cn(
            "absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full text-[9px] font-bold text-ivory",
            tone === "maroon" ? "bg-maroon-600" : "bg-temple-red"
          )}
        >
          {value}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
