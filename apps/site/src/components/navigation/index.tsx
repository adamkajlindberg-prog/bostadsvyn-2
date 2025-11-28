"use client";

import {
  Briefcase,
  Building2,
  HelpCircle,
  Home,
  LogOut,
  Palmtree,
  Plus,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/auth/client";
import Logo from "@/components/common/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const handleAuthAction = async () => {
    if (user) {
      await authClient.signOut();
    } else {
      router.push("/login");
    }
  };

  const handleBrokerLogin = () => {
    router.push("/maklare-login");
  };

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

  // Check if user has admin role for pro badge
  const showProBadge = user?.role === "admin";

  return (
    <nav
      className="sticky top-0 z-30 bg-background border-b border-border transition-all duration-300"
      aria-label="Huvudnavigering"
    >
      <div className="pl-4 pr-0 max-w-full">
        <div className="flex items-center h-10 flex-nowrap">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 flex-shrink-0"
            aria-label="Bostadsvyn startsida"
          >
            <div className="bg-primary ring-2 ring-primary-light rounded-lg p-1 shadow-lg">
              <Logo
                className="h-7 w-7 text-primary-foreground"
                aria-hidden="true"
              />
            </div>
            <span className="text-lg font-bold text-foreground whitespace-nowrap">
              Bostadsvyn.se
            </span>
          </Link>

          {/* Navigation Links */}
          <div
            className="hidden lg:flex items-center space-x-1 ml-3"
            role="menubar"
            aria-label="Huvudmeny"
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:text-primary text-sm"
              asChild
            >
              <Link href="/salj" role="menuitem">
                <Plus className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                Sälj
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:text-primary text-sm"
              asChild
            >
              <Link href="/hyresbostader" role="menuitem">
                <Home className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                Hyra
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:text-primary text-sm"
              asChild
            >
              <Link href="/nyproduktion" role="menuitem">
                <Building2 className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                Nyproduktion
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:text-primary text-sm"
              asChild
            >
              <Link href="/fritid-tomter" role="menuitem">
                <Palmtree className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                Fritid & Tomter
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:text-primary text-sm"
              asChild
            >
              <Link href="/kommersiellt" role="menuitem">
                <Briefcase className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                Kommersiellt
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:text-primary text-sm"
              asChild
            >
              <Link href="/ai-tools" role="menuitem">
                <Sparkles className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                AI-verktyg
                {showProBadge && (
                  <Badge
                    className="ml-1 bg-premium text-premium-foreground text-xs"
                    aria-label="Premium funktion"
                  >
                    Pro
                  </Badge>
                )}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:text-primary text-sm"
              asChild
            >
              <Link href="/om-oss" role="menuitem">
                Om oss
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:text-primary text-sm"
              asChild
            >
              <Link href="/fragor-svar" role="menuitem">
                <HelpCircle className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                Frågor & svar
              </Link>
            </Button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2 ml-auto mr-0">
            {!user && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBrokerLogin}
                className="hidden sm:flex text-sm"
                aria-label="Logga in som fastighetsmäklare"
              >
                <Building2 className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                Mäklare
              </Button>
            )}
            {user ? (
              <>
                {user.role === "broker" && (
                  <Button
                    variant="success"
                    size="sm"
                    className="hidden sm:flex"
                    onClick={() => router.push("/mäklarportal")}
                    aria-label="Öppna mäklarportalen"
                  >
                    <Building2
                      className="h-3.5 w-3.5 mr-1.5"
                      aria-hidden="true"
                    />
                    Mäklarportalen
                  </Button>
                )}

                {user.role !== "broker" && (
                  <Button
                    size="sm"
                    className="hidden sm:flex"
                    onClick={() => router.push("/dashboard")}
                    aria-label="Gå till mina sidor"
                  >
                    <User className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                    Mina sidor
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-7 w-7 rounded-full"
                      aria-label={`Användarmeny för ${user.name || user.email}`}
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {user.name || "Användare"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                        {user.role && (
                          <ul
                            className="flex gap-1 mt-1 list-none"
                            aria-label="Användarroller"
                          >
                            <li>
                              <Badge variant="secondary" className="text-xs">
                                {user.role === "admin"
                                  ? "Admin"
                                  : user.role === "broker"
                                    ? "Mäklare"
                                    : user.role}
                              </Badge>
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    {user.role !== "broker" && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                          <User className="mr-2 h-4 w-4" aria-hidden="true" />
                          <span>Mina sidor</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/support">
                        <HelpCircle
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                        <span>Support & Hjälp</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/moderation">
                          <Shield className="mr-2 h-4 w-4" aria-hidden="true" />
                          <span>Moderering</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleAuthAction}>
                      <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                      <span>Logga ut</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                size="sm"
                onClick={handleAuthAction}
                className="bg-primary hover:bg-primary-deep text-sm"
                aria-label="Logga in på ditt konto"
              >
                <User className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                Logga in
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
