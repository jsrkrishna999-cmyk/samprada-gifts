"use client";

// Supabase client for use in Client Components (browser). Reads the anon
// key, which is safe to expose publicly — real access control happens via
// Row Level Security policies (see supabase/schema.sql).

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
