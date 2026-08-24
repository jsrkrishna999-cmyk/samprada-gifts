"use client";

/**
 * Real authentication via Supabase Auth. Sessions are backed by actual
 * signed-up users with hashed passwords — not the old localStorage demo.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "./toast-context";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthResult {
  error: string | null;
}

interface SignupResult extends AuthResult {
  needsEmailConfirmation: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<SignupResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(user: User | null): AuthUser | null {
  if (!user || !user.email) return null;
  const fullName = (user.user_metadata?.full_name as string | undefined)?.trim();
  const fallback = user.email.split("@")[0].replace(/[._]/g, " ");
  const name = fullName || fallback.charAt(0).toUpperCase() + fallback.slice(1);
  return { id: user.id, name, email: user.email };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(toAuthUser(session?.user ?? null));
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toAuthUser(session?.user ?? null));
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      show("Welcome back!", "info");
      return { error: null };
    },
    [supabase, show]
  );

  const signup = useCallback(
    async (name: string, email: string, password: string): Promise<SignupResult> => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) return { error: error.message, needsEmailConfirmation: false };

      // If email confirmation is required (default Supabase setting), the
      // session is null until the user clicks the link in their inbox.
      const needsEmailConfirmation = !data.session;
      show(
        needsEmailConfirmation
          ? "Check your email to confirm your account"
          : "Account created — welcome to Samprada Gifts",
        "info"
      );
      return { error: null, needsEmailConfirmation };
    },
    [supabase, show]
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    show("Signed out", "info");
  }, [supabase, show]);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
