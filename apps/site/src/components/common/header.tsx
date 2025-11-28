import {
  BriefcaseIcon,
  Building2Icon,
  HomeIcon,
  MenuIcon,
  PalmTreeIcon,
  PlusIcon,
  SparklesIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "./logo";

const navMenu = [
  {
    title: "Sälj",
    url: "/salj",
    icon: PlusIcon,
  },
  {
    title: "Hyra",
    url: "/hyra",
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
    icon: PalmTreeIcon,
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
];

const Header = () => {
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
            {navMenu.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.title}
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:text-primary text-sm"
                  asChild
                >
                  <Link href={item.url} role="menuitem">
                    {Icon && (
                      <Icon className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                    )}
                    {item.title}
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2 ml-auto mr-0">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex text-sm"
              asChild
            >
              <Link
                href="/maklare-login"
                aria-label="Logga in som fastighetsmäklare"
              >
                <Building2Icon
                  className="h-3.5 w-3.5 mr-1.5"
                  aria-hidden="true"
                />
                Mäklare
              </Link>
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary-deep text-sm"
              asChild
            >
              <Link href="/login" aria-label="Logga in på ditt konto">
                <UserIcon className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                Logga in
              </Link>
            </Button>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="lg:hidden"
                  aria-label="Öppna meny"
                >
                  <MenuIcon />
                </button>
              </SheetTrigger>
              <SheetContent className="w-3/4 lg:w-xs">
                <SheetHeader>
                  <SheetTitle className="hidden" />
                  <SheetDescription className="hidden" />
                </SheetHeader>

                <div className="px-4">
                  {navMenu.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="border-b p-3">
                        <Link
                          href={item.url}
                          className="text-sm flex items-center gap-2"
                        >
                          {Icon && <Icon className="h-4 w-4" />}
                          {item.title}
                        </Link>
                      </div>
                    );
                  })}

                  <Button
                    variant="outline"
                    className="flex lg:hidden w-full mt-4"
                    asChild
                  >
                    <Link href="/maklare-login">
                      <Building2Icon /> Mäklare
                    </Link>
                  </Button>
                  <Button className="flex lg:hidden w-full mt-3" asChild>
                    <Link href="/login">
                      <UserIcon /> Logga in
                    </Link>
                  </Button>
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
