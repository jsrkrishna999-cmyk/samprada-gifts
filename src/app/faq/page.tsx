"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What is the minimum order quantity for bulk return gifts?",
    a: "Most collections have no strict minimum, but bulk pricing kicks in from 50 pieces. For weddings and corporate gifting, reach out via Contact Us and we'll put together a custom quote.",
  },
  {
    q: "How long does dispatch and delivery take?",
    a: "In-stock items dispatch within 24-48 hours. Standard delivery takes 4-6 business days; Express delivery (available at checkout) takes 1-2 business days. Bulk orders of 50+ pieces need 5-7 days lead time.",
  },
  {
    q: "Can I customize packaging with names or a company logo?",
    a: "Yes — most products support a printed tag with your family name, event date, or company logo. Mention your requirement in the order notes or contact us before placing a bulk order.",
  },
  {
    q: "What payment methods do you accept?",
    a: "UPI, credit/debit cards, net banking, popular wallets, and Razorpay checkout. Cash on Delivery is available for orders under ₹5,000.",
  },
  {
    q: "What is your return and replacement policy?",
    a: "If an item arrives damaged or incorrect, reach out within 48 hours of delivery with photos and we'll arrange a replacement or refund. Since most items are gifted and consumable, we're unable to accept returns for change of mind.",
  },
  {
    q: "Do you ship internationally?",
    a: "We currently ship pan-India. For international shipping, contact us directly on WhatsApp and we'll advise on feasibility and cost for your location.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Need help?"
        title="Frequently Asked Questions"
        description="Can't find what you're looking for? Reach out on our Contact page."
        align="center"
        className="mx-auto"
      />
      <div className="mx-auto max-w-2xl space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="overflow-hidden rounded-2xl border border-sandalwood-light bg-ivory">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-medium text-maroon-900">{f.q}</span>
                <ChevronDown size={18} className={cn("shrink-0 text-brown-700/40 transition-transform", isOpen && "rotate-180")} />
              </button>
              {isOpen && (
                <p className="px-5 pb-5 text-sm leading-relaxed text-brown-700/75">{f.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </Container>
  );
}
