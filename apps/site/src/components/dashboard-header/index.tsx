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
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">
            Välkommen, {user?.name || "Användare"}
          </h1>
          <div className="flex gap-2 items-center flex-wrap mt-1">
            {user?.role && (
              <Badge variant="secondary">{getRoleLabel(user.role)}</Badge>
            )}
            <Badge
              variant={isPro ? "default" : "outline"}
              className={
                isPro ? "bg-gradient-to-r from-primary to-primary/60" : ""
              }
            >
              {isPro && <span className="mr-1">👑</span>}
              {getSubscriptionLabel()}-konto
            </Badge>
            {!isPro && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-6 text-xs"
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
