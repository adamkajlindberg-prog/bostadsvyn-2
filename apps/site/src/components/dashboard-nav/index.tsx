"use client";

import {
  Calculator,
  ChevronDown,
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
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon | null;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Översikt", icon: LayoutDashboard },
  { href: "/dashboard/favoriter", label: "Favoriter", icon: Heart },
  { href: "/dashboard/mina-annonser", label: "Mina annonser", icon: Home },
  { href: "/dashboard/gruppkonton", label: "Grupp", icon: Users },
  { href: "/dashboard/profil", label: "Profil", icon: User },
  { href: "/dashboard/verktyg", label: "Verktyg", icon: Calculator },
  { href: "/dashboard/ai-bildgalleri", label: "AI-bildgalleri", icon: Sparkles },
  { href: "/dashboard/ai-verktyg", label: "AI-verktyg", icon: Wand2 },
  { href: "/dashboard/meddelanden", label: "Meddelanden", icon: MessageSquare },
  { href: "/dashboard/settings", label: "Inställningar", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  // Memoize active item lookup
  const activeItem = useMemo(() => {
    return navItems.find((item) => pathname === item.href) ?? navItems[0];
  }, [pathname]);

  const ActiveIcon = activeItem.icon;

  return (
    <nav className="w-full" aria-label="Dashboard navigation">
      {/* Mobile Dropdown - visible below sm breakpoint */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between bg-muted hover:bg-muted/80 border-0"
            >
              <span className="flex items-center gap-2">
                {ActiveIcon && <ActiveIcon className="h-4 w-4" />}
                {activeItem.label}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)]"
            align="start"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer",
                      isActive && "bg-accent font-medium",
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop/Tablet Grid - visible at sm breakpoint and above */}
      <div className="hidden sm:block">
        <div className="grid sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-1 rounded-lg bg-muted p-1 text-muted-foreground">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "hover:bg-background/50 hover:text-foreground",
                )}
              >
                {Icon && <Icon className="h-4 w-4 mr-1.5" />}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
