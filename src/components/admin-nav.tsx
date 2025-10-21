"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users } from "lucide-react";
import Logo from "@/components/logo";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
];

export function AdminNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <>
    {isMobile && (
        <div className="p-4 border-b">
            <Logo />
        </div>
    )}
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 mt-4">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              isActive ? "bg-muted text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
    </>
  );
}
