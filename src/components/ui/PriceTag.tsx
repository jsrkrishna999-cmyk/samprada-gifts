import { formatINR, discountPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { ProductStatus } from "@/lib/types";

/**
 * Renders a price, or a status label when the product has no retail price yet.
 * Products imported from the supplier catalog carry cost prices only, which are
 * never shown — they surface as "Price on request" until retail prices are set.
 */
export function PriceTag({
  price,
  mrp,
  status = "active",
  size = "md",
  className,
}: {
  price: number | null;
  mrp: number | null;
  status?: ProductStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const priceSize = { sm: "text-sm", md: "text-base", lg: "text-2xl" }[size];
  const mrpSize = { sm: "text-xs", md: "text-xs", lg: "text-sm" }[size];

  if (price == null || status !== "active") {
    const label = status === "coming_soon" ? "Coming soon" : "Price on request";
    return (
      <div className={cn("flex items-baseline gap-2", className)}>
        <span
          className={cn(
            "font-semibold text-maroon-700",
            size === "lg" ? "text-xl" : priceSize
          )}
        >
          {label}
        </span>
      </div>
    );
  }

  const discount = mrp != null ? discountPercent(price, mrp) : 0;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-semibold text-maroon-700", priceSize)}>
        {formatINR(price)}
      </span>
      {discount > 0 && mrp != null && (
        <>
          <span className={cn("text-brown-700/40 line-through", mrpSize)}>
            {formatINR(mrp)}
          </span>
          <span className="text-xs font-semibold text-temple-red">{discount}% off</span>
        </>
      )}
    </div>
  );
}
