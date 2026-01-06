"use client";

import {
  BriefcaseIcon,
  Building2Icon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  HelpCircleIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  PalmtreeIcon,
  PlusIcon,
  ShieldIcon,
  SparklesIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/auth/client";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getOrganizationBroker } from "@/lib/actions/organization";
import {
  type T_Profile,
  useGetUserProfiles,
} from "../select-profile/hooks/use-get-user-profiles";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Skeleton } from "../ui/skeleton";
import Logo from "./logo";

const navMenu = [
  {
    title: "Sälj",
    url: "/salj",
    icon: PlusIcon,
  },
  {
    title: "Hyra",
    url: "/hyresbostader",
    icon: HomeIcon,
  },
  {
    title: "Nyproduktion",
    url: "/nyproduktion",
    icon: Building2Icon,
  },
  {
    title: "Fritid & Tomter",
    url: "/fritid-tomter",
    icon: PalmtreeIcon,
  },
  {
    title: "Kommersiellt",
    url: "/kommersiellt",
    icon: BriefcaseIcon,
  },
  {
    title: "AI-verktyg",
    url: "/ai-tools",
    icon: SparklesIcon,
  },
  {
    title: "Om oss",
    url: "/om-oss",
  },
  {
    title: "Frågor & svar",
    url: "/fragor-svar",
    icon: HelpCircleIcon,
  },
];

const Header = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const {
    data: profilesData,
    isLoading: isLoadingProfiles,
    error: isErrorProfiles,
  } = useGetUserProfiles();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "broker":
        return "Mäklare";
      case "seller":
        return "Säljare";
      case "buyer":
        return "Köpare";
      default:
        return role;
    }
  };

  const getActiveProfileName = () => {
    if (profilesData && profilesData.length > 0) {
      const activeProfile =
        profilesData.find(
          (profile) => session?.session?.activeOrganizationId === profile.id,
        ) || profilesData[0];
      return activeProfile.name;
    }
  };

  const handleSwitchProfile = async (profile: T_Profile) => {
    if (profile.type === "private") {
      // Clear active organization for private accounts
      await authClient.organization.setActive({
        organizationId: null,
        organizationSlug: "",
      });

      router.push("/dashboard");
    } else {
      // Get broker info for organization
      const broker = await getOrganizationBroker(profile.id);

      if (broker) {
        await authClient.organization.setActive(
          {
            organizationId: profile.id,
            organizationSlug: profile.slug ?? "",
          },
          {
            onSuccess: () => {
              router.push(`/maklare/${broker.id}`);
            },
            onError: (error) => {
              console.error("Error setting active organization:", error);
              toast.error("Kunde inte välja organisation");
            },
          },
        );
      } else {
        toast.error("Ingen mäklare hittades för den valda organisationen");
      }
    }
  };

  // Check if user has admin role for pro badge
  const showProBadge = user?.role === "admin";
  const isBroker = user?.role === "broker";

  const updateArrowVisibility = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      setShowLeftArrow(false);
      setShowRightArrow(false);
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  const handleScrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth / 2;
      container.scrollTo({
        left: container.scrollLeft - scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth / 2;
      container.scrollTo({
        left: container.scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Initial check
    updateArrowVisibility();

    // Set up scroll listener
    container.addEventListener("scroll", updateArrowVisibility);

    // Set up resize listener
    const handleResize = () => {
      updateArrowVisibility();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      container.removeEventListener("scroll", updateArrowVisibility);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateArrowVisibility]);

  return (
    <nav
      className="sticky top-0 z-30 bg-background border-b border-border p-0 md:py-2 md:px-12 transition-all duration-300 w-full overflow-x-hidden"
      aria-label="Huvudnavigering"
    >
      <div className="px-3 sm:px-4 max-w-full w-full">
        <div className="gap-2 flex items-center h-12 md:h-auto flex-nowrap w-full min-w-0">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 shrink-0"
            aria-label="Bostadsvyn startsida"
          >
            <div className="bg-primary ring-2 ring-primary-light rounded-lg p-1 shadow-lg">
              <Logo
                className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground"
                aria-hidden="true"
              />
            </div>
            <span className="hidden md:block text-base sm:text-lg font-bold text-foreground whitespace-nowrap  xs:inline">
              Bostadsvyn.se
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center flex-shrink-0 min-w-0 max-[1450px]:max-w-[65%] max-[1450px]:relative">
            {showLeftArrow && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-0 z-10 h-8 w-8 p-0 bg-background/80 hover:bg-background/90 backdrop-blur-sm max-[1450px]:flex items-center justify-center shadow-sm"
                onClick={handleScrollLeft}
                aria-label="Scrolla vänster"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
            )}
            <div
              ref={scrollContainerRef}
              className="hidden lg:flex items-center space-x-1 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] "
              role="menubar"
              aria-label="Huvudmeny"
            >
              {navMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.title}
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:text-white text-sm flex-shrink-0"
                    asChild
                  >
                    <Link href={item.url} role="menuitem">
                      {Icon && (
                        <Icon className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                      )}
                      {item.title}
                      {item.url === "/ai-tools" && showProBadge && (
                        <Badge
                          className="ml-1 bg-premium text-premium-foreground text-xs"
                          aria-label="Premium funktion"
                        >
                          Pro
                        </Badge>
                      )}
                    </Link>
                  </Button>
                );
              })}
            </div>
            {showRightArrow && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 z-10 h-8 w-8 p-0 bg-background/80 hover:bg-background/90 backdrop-blur-sm max-[1450px]:flex items-center justify-center shadow-sm"
                onClick={handleScrollRight}
                aria-label="Scrolla höger"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            {/* Not logged in */}
            {!user && (
              <Button size="sm" className="text-sm" asChild>
                <Link href="/login" aria-label="Logga in på ditt konto">
                  <UserIcon className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                  <span className="xs:inline">Logga in</span>
                </Link>
              </Button>
            )}

            {/* Logged in */}
            {user && (
              <>
                {/* Broker portal button */}
                {isBroker && (
                  <Button
                    size="sm"
                    className="hidden sm:flex bg-success hover:bg-success/90 text-sm"
                    asChild
                  >
                    <Link
                      href="/maklarportal"
                      aria-label="Öppna mäklarportalen"
                    >
                      <Building2Icon
                        className="h-3.5 w-3.5 mr-1.5"
                        aria-hidden="true"
                      />
                      Mäklarportalen
                    </Link>
                  </Button>
                )}

                {/* Profile switcher */}
                {profilesData && !isLoadingProfiles && !isErrorProfiles ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="sm"
                        className="hidden sm:flex text-sm justify-between min-w-0 max-w-[100px]"
                        variant="outline"
                      >
                        <span className="truncate min-w-0 flex-1 mr-2">
                          {getActiveProfileName()}
                        </span>
                        <ChevronsUpDownIcon className="opacity-50 flex-shrink-0" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 px-0.5 py-2">
                      {profilesData?.map((profile, key) => (
                        <Button
                          key={`profile-${key}`}
                          variant="ghost"
                          className="w-full justify-between rounded-sm"
                          onClick={() => handleSwitchProfile(profile)}
                        >
                          <div className="flex flex-col gap-0.5 text-left overflow-hidden truncate">
                            <div className="text-sm font-medium line-clamp-1">
                              {profile.name}
                            </div>
                            <div className="text-xs line-clamp-1 capitalize">
                              {profile.type}
                            </div>
                          </div>

                          {getActiveProfileName() === profile.name && (
                            <CheckIcon />
                          )}
                        </Button>
                      ))}
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Skeleton className="w-32 h-9" />
                )}

                {/* My pages button for non-brokers */}
                {!isBroker && (
                  <Button size="sm" className="hidden sm:flex text-sm" asChild>
                    <Link href="/dashboard" aria-label="Gå till mina sidor">
                      <UserIcon
                        className="h-3.5 w-3.5 mr-1.5"
                        aria-hidden="true"
                      />
                      Mina sidor
                    </Link>
                  </Button>
                )}

                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                      aria-label={`Användarmeny för ${user.name || user.email}`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm">
                          {user.name || "Användare"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                          {user.email}
                        </p>
                        {user.role && (
                          <div className="flex gap-1 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {getRoleLabel(user.role)}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    {!isBroker && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                          <UserIcon
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                          />
                          <span>Mina sidor</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {isBroker && (
                      <DropdownMenuItem asChild>
                        <Link href="/maklarportal">
                          <Building2Icon
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                          />
                          <span>Mäklarportalen</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/support">
                        <HelpCircleIcon
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                        <span>Support & Hjälp</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin">
                            <ShieldIcon
                              className="mr-2 h-4 w-4"
                              aria-hidden="true"
                            />
                            <span>Admin</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOutIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                      <span>Logga ut</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden p-2"
                  aria-label="Öppna meny"
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle className="sr-only">Meny</SheetTitle>
                  <SheetDescription className="sr-only">
                    Navigeringsmeny
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6">
                  {/* User info in mobile menu */}
                  {user && (
                    <div className="px-2 pb-4 mb-4 border-b">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {user.name || "Användare"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                          {user.role && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {getRoleLabel(user.role)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation items */}
                  <div className="space-y-1">
                    {navMenu.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.title}
                          href={item.url}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-md hover:bg-muted transition-colors"
                        >
                          {Icon && (
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          )}
                          {item.title}
                          {item.url === "/ai-tools" && showProBadge && (
                            <Badge className="ml-auto bg-premium text-premium-foreground text-xs">
                              Pro
                            </Badge>
                          )}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Auth buttons in mobile menu */}
                  <div className="mt-6 px-2 md:px-0 pt-4 border-t space-y-2">
                    {!user ? (
                      <>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/maklare-login">
                            <Building2Icon className="h-4 w-4 mr-2" />
                            Mäklare
                          </Link>
                        </Button>
                        <Button className="w-full" asChild>
                          <Link href="/login">
                            <UserIcon className="h-4 w-4 mr-2" />
                            Logga in
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        {isBroker ? (
                          <Button
                            className="w-full bg-success hover:bg-success/90"
                            asChild
                          >
                            <Link href="/maklarportal">
                              <Building2Icon className="h-4 w-4 mr-2" />
                              Mäklarportalen
                            </Link>
                          </Button>
                        ) : (
                          <Button className="w-full" asChild>
                            <Link href="/dashboard">
                              <UserIcon className="h-4 w-4 mr-2" />
                              Mina sidor
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleSignOut}
                        >
                          <LogOutIcon className="h-4 w-4 mr-2" />
                          Logga ut
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
