import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="9 July 2026"
      sections={[
        {
          title: "1. Acceptance of Terms",
          body: [
            "By accessing or using the Samprada Gifts website, you agree to be bound by these Terms & Conditions and our Privacy Policy.",
          ],
        },
        {
          title: "2. Orders & Payment",
          body: [
            "All orders are subject to availability and confirmation of the order price. Payment is processed securely at checkout via UPI, cards, net banking, wallets, or Razorpay Checkout. Cash on Delivery is available on eligible orders.",
          ],
        },
        {
          title: "3. Shipping & Delivery",
          body: [
            "Dispatch timelines and delivery estimates shown at checkout are indicative. Delays may occur due to logistics constraints, especially during peak festive seasons.",
          ],
        },
        {
          title: "4. Returns & Replacements",
          body: [
            "Damaged, defective, or incorrect items must be reported within 48 hours of delivery, with photographic evidence, for a replacement or refund to be arranged. Due to the gifting and consumable nature of most products, we do not accept returns for change of mind.",
          ],
        },
        {
          title: "5. Pricing & Offers",
          body: [
            "Prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. Coupon codes and festival offers are valid for limited periods and cannot be combined unless explicitly stated.",
          ],
        },
        {
          title: "6. Limitation of Liability",
          body: [
            "Samprada Gifts is not liable for indirect or consequential losses arising from delayed delivery, except where required by applicable law.",
          ],
        },
        {
          title: "7. Governing Law",
          body: [
            "These terms are governed by the laws of India, with courts in Vijayawada, Andhra Pradesh having exclusive jurisdiction.",
          ],
        },
      ]}
    />
  );
}
