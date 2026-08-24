import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "default" | "warn";
}) {
  return (
    <div className="rounded-2xl border border-sandalwood-light bg-ivory p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-brown-700/55">
          {label}
        </p>
        <span
          className={cn(
            "grid h-8 w-8 place-items-center rounded-full",
            tone === "warn" ? "bg-gold-light/40 text-gold-dark" : "bg-cream text-maroon-600"
          )}
        >
          <Icon size={15} />
        </span>
      </div>
      <p className="font-serif text-2xl text-maroon-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-brown-700/55">{hint}</p>}
    </div>
  );
}
