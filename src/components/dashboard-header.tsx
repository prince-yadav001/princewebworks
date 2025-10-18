import Link from "next/link";
import {
  Bell,
  Home,
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
import { notifications } from "@/lib/placeholder-data";

export function DashboardHeader() {
  const unreadNotifications = notifications.filter(n => !n.read).length;

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
          <SidebarNav />
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
            {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unreadNotifications}
                </span>
            )}
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.slice(0, 4).map(notification => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1">
                <p className="font-semibold">{notification.title}</p>
                <p className="text-xs text-muted-foreground">{notification.description}</p>
            </DropdownMenuItem>
          ))}
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
