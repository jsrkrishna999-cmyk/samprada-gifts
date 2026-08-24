import type { Metadata } from "next";
import { requireAdmin } from "@/lib/supabase/admin";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin",
  // Keep the owner-facing area out of search results entirely.
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-6 px-4 py-6 lg:flex-row lg:px-8">
        <AdminNav email={admin.email} />
        <main className="min-w-0 flex-1 pb-16">{children}</main>
      </div>
    </div>
  );
}
