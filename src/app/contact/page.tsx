"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/toast-context";

const infoCards = [
  { icon: MapPin, title: "Visit", body: "Vijayawada, Andhra Pradesh" },
  { icon: Phone, title: "Call / WhatsApp", body: "+91 8688085332", href: "tel:+918688085332" },
  {
    icon: Mail,
    title: "Email",
    body: "jsrkrishna999@gmail.com",
    href: "mailto:jsrkrishna999@gmail.com",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { show } = useToast();

  return (
    <div>
      <div className="border-b border-sandalwood-light/60 bg-ivory py-14">
        <Container>
          <SectionHeading
            eyebrow="We'd love to hear from you"
            title="Contact Samprada Gifts"
            description="Bulk orders, custom hampers, or shipping questions — our team usually responds within one business day."
            className="mb-0"
          />
        </Container>
      </div>

      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
              show("Message sent — we'll get back to you soon", "info");
            }}
            className="space-y-4 rounded-2xl border border-sandalwood-light bg-ivory p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Name" required />
              <TextField label="Email" type="email" required />
            </div>
            <TextField label="Occasion" placeholder="Wedding, Navaratri, Corporate..." />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brown-700/70">Message</label>
              <textarea
                required
                rows={5}
                className="w-full rounded-lg border border-sandalwood-light bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-maroon-600"
              />
            </div>
            <Button type="submit" size="lg">
              <Send size={15} /> Send Message
            </Button>
            {submitted && (
              <p className="text-sm text-green-700">
                Thanks — your message has been noted (demo form, not wired to email yet).
              </p>
            )}
          </form>

          <div className="space-y-4">
            {infoCards.map((c) => (
              <div key={c.title} className="flex items-start gap-3 rounded-2xl border border-sandalwood-light bg-ivory p-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream text-maroon-600">
                  <c.icon size={18} />
                </div>
                <div>
                  <p className="font-medium text-maroon-900">{c.title}</p>
                  {("href" in c) ? (
                    <a
                      href={c.href}
                      className="mt-1 inline-block text-sm text-brown-700/70 transition-colors hover:text-maroon-600"
                    >
                      {c.body}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-brown-700/70">{c.body}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-sandalwood-light bg-ivory p-5">
              <p className="font-medium text-maroon-900">Business Hours</p>
              <p className="mt-1 text-sm text-brown-700/70">Mon – Sat, 10 AM – 7 PM IST</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function TextField({
  label,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-xs font-medium text-brown-700/70">{label}</span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-sandalwood-light bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-maroon-600"
      />
    </label>
  );
}
