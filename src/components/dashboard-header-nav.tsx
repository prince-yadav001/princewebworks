"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ListTodo,
  Phone,
  History,
  Settings,
  Briefcase,
  FileText,
  BarChart,
} from "lucide-react";

export function DashboardHeaderNav() {
  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/analytics", icon: BarChart, label: "Analytics" },
    { href: "/dashboard/leads", icon: Users, label: "Leads" },
    { href: "/dashboard/tasks", icon: ListTodo, label: "Tasks" },
    { href: "/dashboard/calls", icon: Phone, label: "Calls" },
    { href: "/dashboard/jobs", icon: Briefcase, label: "Job Opportunities" },
    { href: "/dashboard/my-applications", icon: FileText, label: "My Applications" },
    { href: "/dashboard/activity", icon: History, label: "Activity" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 mt-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
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
  );
}
