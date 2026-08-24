"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Only allow same-site relative paths, so ?next= can't be used to bounce
  // a freshly-authenticated user off to an attacker's URL.
  const rawNext = searchParams.get("next");
  const next = rawNext && /^\/(?!\/)/.test(rawNext) ? rawNext : "/account";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push(next);
    router.refresh();
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
        {error && (
          <p className="rounded-lg bg-temple-red/10 px-3.5 py-2.5 text-xs text-temple-red">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          <LogIn size={16} /> {submitting ? "Logging in..." : "Log In"}
        </Button>
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
