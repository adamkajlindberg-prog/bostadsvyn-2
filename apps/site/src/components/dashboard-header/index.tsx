"use client";

import type { User } from "@/auth/config";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
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
          <div className="flex gap-2 items-center flex-wrap">
            {user?.role && (
              <Badge variant="secondary">
                {user.role === "admin"
                  ? "Admin"
                  : user.role === "broker"
                    ? "Mäklare"
                    : user.role === "seller"
                      ? "Säljare"
                      : user.role}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
