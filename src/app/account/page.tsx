"use client";

import Link from "next/link";
import { Heart, LogOut, MapPin, Package, User } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { useAuth } from "@/context/auth-context";
import { mockAddresses } from "@/lib/data/mock-account";

export default function AccountPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <Container className="flex flex-col items-center py-24 text-center">
        <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-ivory text-maroon-600">
          <User size={26} />
        </div>
        <h1 className="font-serif text-2xl text-maroon-900">You&rsquo;re not logged in</h1>
        <p className="mt-2 max-w-sm text-brown-700/60">
          Log in to view your profile, orders, and saved addresses.
        </p>
        <LinkButton href="/login" className="mt-6">
          Log In
        </LinkButton>
      </Container>
    );
  }

  const address = mockAddresses[0];

  return (
    <Container className="py-10">
      <SectionHeading eyebrow="My Account" title={`Hello, ${user.name}`} className="mb-8" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-sandalwood-light bg-ivory p-6 lg:col-span-1">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-maroon-600 font-serif text-xl text-ivory">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-serif text-lg text-maroon-900">{user.name}</p>
              <p className="text-sm text-brown-700/60">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-sandalwood-light py-2.5 text-sm font-medium text-brown-700/80 hover:bg-cream"
          >
            <LogOut size={15} /> Log Out
          </button>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Link
            href="/orders"
            className="flex items-center justify-between rounded-2xl border border-sandalwood-light bg-ivory p-5 transition-colors hover:border-maroon-600"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-cream text-maroon-600">
                <Package size={19} />
              </div>
              <div>
                <p className="font-medium text-maroon-900">Order History</p>
                <p className="text-xs text-brown-700/50">Track and review past orders</p>
              </div>
            </div>
            <span className="text-brown-700/40">→</span>
          </Link>

          <Link
            href="/wishlist"
            className="flex items-center justify-between rounded-2xl border border-sandalwood-light bg-ivory p-5 transition-colors hover:border-maroon-600"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-cream text-maroon-600">
                <Heart size={19} />
              </div>
              <div>
                <p className="font-medium text-maroon-900">Wishlist</p>
                <p className="text-xs text-brown-700/50">Items you&rsquo;ve saved for later</p>
              </div>
            </div>
            <span className="text-brown-700/40">→</span>
          </Link>

          <div className="rounded-2xl border border-sandalwood-light bg-ivory p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-cream text-maroon-600">
                <MapPin size={19} />
              </div>
              <div>
                <p className="font-medium text-maroon-900">Saved Address</p>
                <p className="text-xs text-brown-700/50">Default delivery address</p>
              </div>
            </div>
            {address && (
              <div className="mt-4 rounded-xl bg-cream p-4 text-sm text-brown-700/75">
                <p className="font-medium text-brown-700">{address.fullName}</p>
                <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                <p>{address.city}, {address.state} {address.pincode}</p>
                <p className="mt-1">{address.phone}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
