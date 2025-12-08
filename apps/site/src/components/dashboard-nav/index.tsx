"use client";

import {
  Calculator,
  Heart,
  Home,
  MessageSquare,
  Settings,
  Sparkles,
  User,
  Users,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Översikt", icon: null },
  { href: "/dashboard/favoriter", label: "Favoriter", icon: Heart },
  { href: "/dashboard/mina-annonser", label: "Mina annonser", icon: Home },
  { href: "/dashboard/gruppkonton", label: "Grupp", icon: Users },
  { href: "/dashboard/profil", label: "Profil", icon: User },
  {
    href: "/dashboard/verktyg",
    label: "Verktyg",
    icon: Calculator,
  },
  {
    href: "/dashboard/ai-bildgalleri",
    label: "AI-bildgalleri",
    icon: Sparkles,
  },
  {
    href: "/dashboard/ai-verktyg",
    label: "AI-verktyg",
    icon: Wand2,
  },
  {
    href: "/dashboard/meddelanden",
    label: "Meddelanden",
    icon: MessageSquare,
  },
  {
    href: "/dashboard/settings",
    label: "Inställningar",
    icon: Settings,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-1 rounded-lg bg-muted p-1 text-muted-foreground">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "hover:bg-background/50 hover:text-foreground",
              )}
            >
              {Icon && <Icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />}
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
