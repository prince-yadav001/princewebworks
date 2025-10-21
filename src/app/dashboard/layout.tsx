"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import Logo from "@/components/logo";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { DashboardHeaderNav } from "@/components/dashboard-header-nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // ✅ redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading dashboard...
      </div>
    );
  }
  
  // Prevent non-admin users from accessing /admin routes if they land here
  // Although middleware is a better place for this check
  if (user?.role !== 'ADMIN' && router.pathname?.startsWith('/admin')) {
      router.push(`/${user.id}/dashboard`);
      return <p>Redirecting...</p>
  }


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Logo />
          </div>
          <div className="flex-1 overflow-y-auto">
             <DashboardHeaderNav />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-secondary/40">
          {children}
        </main>
      </div>
    </div>
  );
}
