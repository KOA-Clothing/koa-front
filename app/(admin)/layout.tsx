import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import AdminHeader from "@/components/admin/admin-header";
import { AppSidebar } from "@/components/admin/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "KOA Admin Dashboard",
  description: "Manage KOA products, inventory, customers, and operations.",
};

export default async function AdminLayout({ children }: LayoutProps<"/">) {
  const { sessionClaims } = await auth.protect();

  const role = sessionClaims?.metadata?.role;

  if (role !== "admin") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-muted">
        <a
          href="#admin-content"
          className="sr-only z-50 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-3 focus:ring-ring/50"
        >
          Skip to main content
        </a>
        <AppSidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <AdminHeader />
          <div
            id="admin-content"
            tabIndex={-1}
            className="flex-1 p-4 outline-none sm:p-6"
          >
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
