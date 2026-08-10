"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/toast-context";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const { show } = useToast();

  return (
    <section className="py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-maroon-600 to-maroon-900 px-6 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-temple-red/30 blur-3xl" />
          <div className="relative mx-auto max-w-lg">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-ivory/10">
              <Mail className="text-gold-light" size={22} />
            </div>
            <h2 className="font-serif text-3xl font-semibold text-ivory sm:text-4xl">
              Get early access to festival collections
            </h2>
            <p className="mt-3 text-ivory/70">
              Join our list for gifting guides, launch previews, and member-only offers.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!email) return;
                show("Subscribed! Welcome to the Samprada circle.", "info");
                setEmail("");
              }}
              className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-full border border-ivory/20 bg-ivory/10 px-5 py-3 text-sm text-ivory placeholder:text-ivory/50 outline-none focus:border-gold-light"
              />
              <Button type="submit" variant="secondary" className="shrink-0">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
