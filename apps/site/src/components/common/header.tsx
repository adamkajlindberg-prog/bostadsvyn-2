import { Building2Icon, MenuIcon, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "./logo"
import Link from "next/link"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const navMenu = [
    {
        title: "Köp",
        url: "/kop"
    },
    {
        title: "Sälj",
        url: "/salj"
    },
    {
        title: "Hyra",
        url: "/hyra"
    },
    {
        title: "Nyproduktion",
        url: "/nyproduktion"
    },
    {
        title: "Fritid & Tomter",
        url: "/fritid-tomter"
    },
    {
        title: "Kommersiellt",
        url: "/kommersiellt"
    },
    {
        title: "AI-verktyg",
        url: "/ai-tools"
    },
    {
        title: "Om oss",
        url: "/om-oss"
    }
]

const Header = () => {
    return (
        <header className="@container sticky top-0 bg-background w-full z-50 shadow-sm">
            <div className="flex items-center justify-between container mx-auto py-3 @lg:py-4 px-6 @lg:px-8">
                {/* Logo */}
                <Link href="/">
                    <div className="flex items-center gap-x-3">
                        <div className="bg-primary ring-2 ring-primary-light rounded-lg p-1 shadow-lg">
                            <Logo className="h-6 w-6 @lg:h-7 @lg:w-7 text-primary-foreground" aria-hidden="true" />
                        </div>
                        
                        <h2 className="font-semibold text-lg @lg:text-xl">
                            Bostadsvyn.se
                        </h2>
                    </div>
                </Link>

                {/* Navigation menu for extra large screens */}
                <div className="hidden @7xl:flex items-center gap-x-6 2xl:gap-x-8">
                    {navMenu.map((item) => (
                        <Link key={item.title} href={item.url} className="text-sm font-medium hover:underline underline-offset-2 hover:opacity-80">
                            {item.title}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-x-4">
                    <Link href="/maklare-login">
                    <Button variant="outline" className="hidden @xl:flex"><Building2Icon /> Mäklare</Button>
                    </Link>
                    <Link href="/login">
                        <Button className="hidden @xl:flex"><UserIcon /> Logga in</Button>
                    </Link>

                    {/* Navigation menu for small - large screens */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="@7xl:hidden">
                                <MenuIcon />
                            </button>
                        </SheetTrigger>
                        <SheetContent className="w-3/4 lg:w-xs">
                            <SheetHeader>
                                <SheetTitle className="hidden" />
                                <SheetDescription className="hidden" />
                            </SheetHeader>
                            
                            <div className="px-4">
                                {navMenu.map((item) => (
                                    <div key={item.title} className="border-b p-3">
                                        <Link  href={item.url} className="text-sm">
                                            {item.title}
                                        </Link>
                                    </div>
                                ))}

                                <Button variant="outline" className="flex lg:hidden w-full mt-4"><Building2Icon /> Mäklare</Button>
                                <Button className="flex lg:hidden w-full mt-3"><UserIcon /> Logga in</Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div> 
            </div>
        </header>
    )
}

export default Header