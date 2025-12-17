"use client";

import Link from "next/link";
import type { User } from "@/auth/config";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SubscriptionTier = "free" | "pro" | "pro_plus";

interface DashboardHeaderProps {
  user: User;
  subscriptionTier?: SubscriptionTier;
}

export function DashboardHeader({
  user,
  subscriptionTier = "free",
}: DashboardHeaderProps) {
  const isPro = subscriptionTier === "pro" || subscriptionTier === "pro_plus";

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

  const getSubscriptionLabel = () => {
    switch (subscriptionTier) {
      case "pro_plus":
        return "Pro+";
      case "pro":
        return "Pro";
      default:
        return "Bas";
    }
  };

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
        <Avatar className="h-10 w-10 sm:h-14 sm:w-14 md:h-16 md:w-16 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm md:text-base">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold break-words">
            Välkommen, {user?.name || "Användare"}
          </h1>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center justify-center sm:justify-start mt-1.5 sm:mt-2">
            {user?.role && (
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {getRoleLabel(user.role)}
              </Badge>
            )}
            <Badge
              variant={isPro ? "default" : "outline"}
              className={`text-xs sm:text-sm ${
                isPro ? "bg-gradient-to-r from-primary to-primary/60" : ""
              }`}
            >
              {isPro && <span className="mr-1">👑</span>}
              {getSubscriptionLabel()}-konto
            </Badge>
            {!isPro && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-6 sm:h-7 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Link href="/upgrade">Uppgradera</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
