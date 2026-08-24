"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, UserPlus } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/auth-context";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await signup(name, email, password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.needsEmailConfirmation) {
      setConfirmationSent(true);
      return;
    }
    router.push("/account");
  }

  if (confirmationSent) {
    return (
      <AuthLayout title="Check your email" subtitle="One last step before you're in.">
        <div className="rounded-lg bg-ivory px-4 py-6 text-center">
          <Mail className="mx-auto mb-3 text-maroon-600" size={28} />
          <p className="text-sm text-brown-700/80">
            We&rsquo;ve sent a confirmation link to <strong>{email}</strong>. Click it to
            activate your account, then come back and log in.
          </p>
        </div>
        <p className="mt-6 text-center text-sm text-brown-700/70">
          <Link href="/login" className="font-semibold text-maroon-600 hover:text-maroon-700">
            Back to log in
          </Link>
        </p>
      </AuthLayout>
    );
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full rounded-lg border border-sandalwood-light bg-ivory px-3.5 py-2.5 text-sm outline-none focus:border-maroon-600"
          />
        </div>
        {error && (
          <p className="rounded-lg bg-temple-red/10 px-3.5 py-2.5 text-xs text-temple-red">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          <UserPlus size={16} /> {submitting ? "Creating account..." : "Create Account"}
        </Button>
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
