"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/auth-context";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    signup(name, email);
    router.push("/account");
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join Samprada Gifts for faster checkout and order tracking.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-brown-700/70">Full Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border border-sandalwood-light bg-ivory px-3.5 py-2.5 text-sm outline-none focus:border-maroon-600"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-brown-700/70">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-sandalwood-light bg-ivory px-3.5 py-2.5 text-sm outline-none focus:border-maroon-600"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-brown-700/70">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full rounded-lg border border-sandalwood-light bg-ivory px-3.5 py-2.5 text-sm outline-none focus:border-maroon-600"
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          <UserPlus size={16} /> Create Account
        </Button>
        <p className="rounded-lg bg-ivory px-3.5 py-2.5 text-xs text-brown-700/50">
          Demo signup — this stores a local profile only, no real account is created.
        </p>
      </form>
      <p className="mt-6 text-center text-sm text-brown-700/70">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-maroon-600 hover:text-maroon-700">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
