import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderSuccessContent } from "@/components/OrderSuccessContent";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  );
}
