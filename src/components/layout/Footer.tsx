"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useCatalog } from "@/context/catalog-context";
import { useToast } from "@/context/toast-context";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/icons/SocialIcons";

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQ" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const { show } = useToast();
  const { categories } = useCatalog();
  const shopLinks = categories.slice(0, 6);

  return (
    <footer className="mt-20 bg-brown-700 text-ivory">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr]">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gold font-serif text-lg text-maroon-900">
                S
              </span>
              <span className="font-serif text-xl font-semibold">Samprada Gifts</span>
            </div>
            <p className="max-w-sm text-sm text-ivory/65">
              Premium, tradition-rooted return gifts for haldi kumkum, weddings,
              housewarmings, and every festive celebration — curated for modern
              Indian homes.
            </p>
            <div className="mt-5 flex gap-3">
              {[InstagramIcon, FacebookIcon, YoutubeIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid h-9 w-9 place-items-center rounded-full bg-ivory/10 transition-colors hover:bg-gold hover:text-maroon-900"
                >
                  <Icon width={16} height={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-base">Shop</h3>
            <ul className="space-y-2.5 text-sm text-ivory/65">
              {shopLinks.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="hover:text-gold-light">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-base">Company</h3>
            <ul className="space-y-2.5 text-sm text-ivory/65">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-gold-light">
                    {l.label}
                  </Link>
                </li>
              ))}
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-gold-light">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-base">Stay in the loop</h3>
            <p className="mb-4 text-sm text-ivory/65">
              Festival launches, gifting guides, and early access to new
              collections — straight to your inbox.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!email) return;
                show("Subscribed! Welcome to the Samprada circle.", "info");
                setEmail("");
              }}
              className="flex items-center gap-2 rounded-full bg-ivory/10 p-1.5"
            >
              <input
                type="email"
                required
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full bg-transparent px-3 text-sm text-ivory placeholder:text-ivory/40 outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-maroon-900 transition-transform hover:scale-105"
              >
                <Send size={14} />
              </button>
            </form>

            <div className="mt-6 space-y-2 text-sm text-ivory/65">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-gold-light" /> Vijayawada, Andhra Pradesh
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-gold-light" />
                <a href="tel:+918688085332" className="transition-colors hover:text-gold-light">
                  +91 8688085332
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-gold-light" />
                <a
                  href="mailto:jsrkrishna999@gmail.com"
                  className="transition-colors hover:text-gold-light"
                >
                  jsrkrishna999@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t border-ivory/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-xs text-ivory/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Samprada Gifts. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Secure payments via</span>
            <span className="rounded bg-ivory/10 px-2 py-1 font-medium text-ivory/70">UPI</span>
            <span className="rounded bg-ivory/10 px-2 py-1 font-medium text-ivory/70">Cards</span>
            <span className="rounded bg-ivory/10 px-2 py-1 font-medium text-ivory/70">Razorpay</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
