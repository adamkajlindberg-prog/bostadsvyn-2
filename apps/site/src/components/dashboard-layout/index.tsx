"use client";

import { Menu } from "lucide-react";
import type { User } from "@/auth/config";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface DashboardLayoutClientProps {
  user: User;
  children: React.ReactNode;
}

export function DashboardLayoutClient({
  user,
  children,
}: DashboardLayoutClientProps) {
  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
          <SidebarTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Öppna meny</span>
            </Button>
          </SidebarTrigger>
          <span className="font-semibold">Dashboard</span>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
