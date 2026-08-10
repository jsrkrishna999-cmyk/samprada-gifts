import { formatINR, discountPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PriceTag({
  price,
  mrp,
  size = "md",
  className,
}: {
  price: number;
  mrp: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const discount = discountPercent(price, mrp);
  const priceSize = { sm: "text-sm", md: "text-base", lg: "text-2xl" }[size];
  const mrpSize = { sm: "text-xs", md: "text-xs", lg: "text-sm" }[size];

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-semibold text-maroon-700", priceSize)}>
        {formatINR(price)}
      </span>
      {discount > 0 && (
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
