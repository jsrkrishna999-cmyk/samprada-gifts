import { cn } from "@/lib/utils";

const orderTone: Record<string, string> = {
  processing: "bg-gold-light/50 text-maroon-900",
  shipped: "bg-maroon-100 text-maroon-700",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-700",
};

const paymentTone: Record<string, string> = {
  pending: "bg-sandalwood-light/60 text-brown-700",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-brown-700/10 text-brown-700",
};

export function OrderStatusPill({
  status,
  paymentStatus,
}: {
  status: string;
  paymentStatus?: string;
}) {
  return (
    <span className="flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize",
          orderTone[status] ?? "bg-cream text-brown-700"
        )}
      >
        {status}
      </span>
      {paymentStatus && (
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize",
            paymentTone[paymentStatus] ?? "bg-cream text-brown-700"
          )}
        >
          {paymentStatus}
        </span>
      )}
    </span>
  );
}
