// Server-only: createClient() below reads cookies() from next/headers, which
// throws if this module is ever pulled into a Client Component.
import { redirect } from "next/navigation";
import { createClient } from "./server";

export interface AdminUser {
  id: string;
  email: string;
}

/**
 * Returns the signed-in admin, or null. Membership is read from the `admins`
 * table, whose select policy is itself admin-gated — so a non-admin gets an
 * empty result rather than a leak of who the admins are.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("admins")
    .select("user_id, email")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) return null;
  return { id: data.user_id, email: data.email };
}

/**
 * Guard for admin pages. Redirects rather than rendering a 403 so the URL
 * doesn't confirm that /admin exists to someone poking around.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) redirect("/login?next=/admin");
  return admin;
}
