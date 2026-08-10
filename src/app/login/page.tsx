"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(email);
    router.push("/account");
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to track orders, wishlist favorites, and check out faster.">
      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="••••••••"
            className="w-full rounded-lg border border-sandalwood-light bg-ivory px-3.5 py-2.5 text-sm outline-none focus:border-maroon-600"
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          <LogIn size={16} /> Log In
        </Button>
        <p className="rounded-lg bg-ivory px-3.5 py-2.5 text-xs text-brown-700/50">
          Demo login — enter any email/password to continue. No real account is created.
        </p>
      </form>
      <p className="mt-6 text-center text-sm text-brown-700/70">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-maroon-600 hover:text-maroon-700">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
