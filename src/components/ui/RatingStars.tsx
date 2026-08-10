import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  size = 14,
  showValue = false,
  className,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(rating);
          return (
            <Star
              key={i}
              size={size}
              className={filled ? "fill-gold text-gold" : "fill-transparent text-sandalwood"}
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-brown-700/70">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
