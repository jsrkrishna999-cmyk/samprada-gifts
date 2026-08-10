"use client";

/**
 * Demo-only auth. There is no backend yet, so this simply stores a user
 * profile in localStorage to simulate a signed-in session. Do not treat
 * this as real authentication — it does not verify passwords or issue
 * real tokens. Replace with real JWT-backed auth when the API layer is
 * built.
 */

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useToast } from "./toast-context";

const STORAGE_KEY = "sg_demo_user_v1";

export interface DemoUser {
  name: string;
  email: string;
  phone?: string;
}

interface AuthContextValue {
  user: DemoUser | null;
  login: (email: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const { show } = useToast();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (u: DemoUser | null) => {
    setUser(u);
    if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else window.localStorage.removeItem(STORAGE_KEY);
  };

  const login = useCallback((email: string) => {
    const name = email.split("@")[0].replace(/[._]/g, " ");
    persist({ name: name.charAt(0).toUpperCase() + name.slice(1), email });
    show("Welcome back!", "info");
  }, [show]);

  const signup = useCallback((name: string, email: string) => {
    persist({ name, email });
    show("Account created — welcome to Samprada Gifts", "info");
  }, [show]);

  const logout = useCallback(() => {
    persist(null);
    show("Signed out", "info");
  }, [show]);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
