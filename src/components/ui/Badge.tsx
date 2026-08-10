import { cn } from "@/lib/utils";

const styles = {
  bestseller: "bg-maroon-600 text-ivory",
  new: "bg-temple-red text-ivory",
  trending: "bg-gold text-maroon-900",
  limited: "bg-brown text-ivory",
  discount: "bg-temple-red-600 text-ivory",
};

const labels: Record<string, string> = {
  bestseller: "Bestseller",
  new: "New",
  trending: "Trending",
  limited: "Limited",
};

export function Badge({
  kind,
  children,
  className,
}: {
  kind: keyof typeof styles;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
        styles[kind],
        className
      )}
    >
      {children ?? labels[kind]}
    </span>
  );
}
