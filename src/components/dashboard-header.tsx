"use client"

import Link from "next/link";
import {
  Bell,
  Menu,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "./sidebar-nav";
import WorkspaceSwitcher from "./workspace-switcher";
import { UserNav } from "./user-nav";
import Logo from "./logo";
import { useAuth } from "@/context/AuthContext";
import { DashboardHeaderNav } from "./dashboard-header-nav";

export function DashboardHeader() {
  const { user } = useAuth();
  
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <div className="p-4 border-b">
            <Logo />
          </div>
           {user?.role === 'ADMIN' ? (
              <p>Admin nav coming soon</p>
            ) : (
             <DashboardHeaderNav />
            )}
        </SheetContent>
      </Sheet>

      <WorkspaceSwitcher />

      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search leads, tasks..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <p className="text-xs text-muted-foreground">No new notifications.</p>
          </DropdownMenuItem>
           <DropdownMenuSeparator />
           <DropdownMenuItem className="text-center justify-center" asChild>
                <Link href="/dashboard/notifications">View all notifications</Link>
           </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserNav />
    </header>
  );
}
