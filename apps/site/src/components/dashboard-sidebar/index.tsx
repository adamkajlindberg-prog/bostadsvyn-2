"use client";

import {
  Calculator,
  Heart,
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
  User,
  Users,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User as AuthUser } from "@/auth/config";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/dashboard", label: "Översikt", icon: LayoutDashboard },
  { href: "/dashboard/favoriter", label: "Favoriter", icon: Heart },
  { href: "/dashboard/mina-annonser", label: "Mina annonser", icon: Home },
  { href: "/dashboard/gruppkonton", label: "Gruppkonton", icon: Users },
  { href: "/dashboard/profil", label: "Profil", icon: User },
  { href: "/dashboard/verktyg", label: "Verktyg", icon: Calculator },
  { href: "/dashboard/ai-bildgalleri", label: "AI-bildgalleri", icon: Sparkles },
  { href: "/dashboard/ai-verktyg", label: "AI-verktyg", icon: Wand2 },
  { href: "/dashboard/meddelanden", label: "Meddelanden", icon: MessageSquare },
  { href: "/dashboard/settings", label: "Inställningar", icon: Settings },
];

interface DashboardSidebarProps {
  user: AuthUser;
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "AN";
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "broker":
        return "Mäklare";
      case "seller":
        return "Säljare";
      case "buyer":
        return "Privatperson";
      case "company":
        return "Företag";
      default:
        return role;
    }
  };

  const handleNavClick = () => {
    // Close mobile sidebar when a nav item is clicked
    setOpenMobile(false);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden min-w-0">
            <span className="truncate font-medium text-sm">
              {user?.name || "Användare"}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {user?.role && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  {getRoleLabel(user.role)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Meny</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link href={item.href} onClick={handleNavClick}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="px-2 py-2 text-xs text-muted-foreground" suppressHydrationWarning>
          © {new Date().getFullYear()} Bostadsvyn
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
