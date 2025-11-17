import { Card, CardContent } from "@/components/ui/card"
import { ArrowRightIcon, BrainIcon, CalculatorIcon, FileTextIcon, SearchIcon, SparklesIcon, TrendingUpIcon, UsersIcon } from "lucide-react"
import Image from "next/image"
import livingRoomBefore from "@/images/living-room-before.webp"
import livingRoomAfter from "@/images/living-room-after.webp"
import villaBefore from "@/images/villa-before-edit.webp"
import villaAfter from "@/images/villa-after-with-pool.webp"
import Link from "next/link"

const highlights = [
    {
        badgeIcon: <BrainIcon size={16} className="text-primary-foreground" /> ,
        badgeText: "AI-Homestyling",
        title: "Se potentialen i varje rum",
        description: "Vår AI-teknik kan transformera rum till den stil eller miljö som önskas så att du som köpare kan visualisera din framtida bostad.",
        details: [
            "Fotorealistiska resultat på sekunder", 
            "Olika inredningsstilar att välja mellan",
            "Automatisk anpassning till rumsstorlek"
        ],
        imageBefore: livingRoomBefore,
        imageBeforeAlt: "Vardagsrum innan",
        imageAfter: livingRoomAfter,
        imageAfterAlt: "Vardagsrum efter"
    },
    {
        badgeIcon: <SparklesIcon size={16} className="text-primary-foreground" /> ,
        badgeText: "AI Bildredigering",
        title: "Visualisera renoveringar, förändringar och tillbyggnader",
        description: "Vårt AI-verktyg låter dig enkelt lägga till eller ta bort element från fastighetbilder. Visa potentialen i utomhusutrymmen genom att lägga till pooler, terrasser, och andra förbättringar.",
        details: [
            "Lägg till pooler, terrasser och uteplatser", 
            "Ta bort eller ändra befintliga element",
            "Visa renoveringspotential i olika stilar"
        ],
        imageBefore: villaBefore,
        imageBeforeAlt: "Villa innan",
        imageAfter: villaAfter,
        imageAfterAlt: "Villa efter"
    }
]

const features = [
    {
        href: "/ai-homestyling",
        badgeIcon: <BrainIcon size={44} className="text-primary/70 p-2.5 bg-primary-light/10 rounded-md" />,
        badgeText: "Populär",
        title: "AI-Homestyling",
        description: "Transformera tomma rum till inredda drömhem med vår avancerade AI-teknik",
        details: [
            "Fotorealistiska resultat",
            "Olika stilar",
            "Snabb rendering"
        ]
    },
    {
        href: "/prisanalys",
        badgeIcon: <TrendingUpIcon size={44} className="text-primary/70 p-2.5 bg-primary-light/10 rounded-md" />,
        badgeText: "AI-driven",
        title: "Prisanalys & Prognoser",
        description: "Få exakta värderingar och framtida prisförutsägelser baserat på marknadsdata",
        details: [
            "Realtidsdata",
            "Konfidensintervall",
            "Områdesanalys"
        ]
    },
    {
        href: "/maklarportal",
        badgeIcon: <UsersIcon size={44} className="text-primary/70 p-2.5 bg-primary-light/10 rounded-md" />,
        badgeText: "Professionell",
        title: "Mäklarportal",
        description: "Professionella verktyg för mäklare att hantera kunder, visningar och annonser",
        details: [
            "Kundhantering",
            "Statistik & rapporter",
            "Automatisering"
        ]
    },
    {
        href: "/digitala-hyreskontrakt",
        badgeIcon: <FileTextIcon size={44} className="text-primary/70 p-2.5 bg-primary-light/10 rounded-md" />,
        badgeText: "Säker",
        title: "Digitala Hyreskontrakt",
        description: "Säkra signeringar med BankID och automatiserade juridiska dokument",
        details: [
            "BankID-integration",
            "Automatisering",
            "Juridisk säkerhet"
        ]
    },
    {
        href: "#",
        badgeIcon: <CalculatorIcon size={44} className="text-primary/70 p-2.5 bg-primary-light/10 rounded-md" />,
        title: "Kostnadskalkylator",
        description: "Beräkna totala kostnader inklusive skatter, avgifter och låneinformation",
        details: [
            "Lånekalkyler",
            "Skatteinfo",
            "Månadsbudget"
        ]
    },
    {
        href: "#",
        badgeIcon: <SearchIcon size={44} className="text-primary/70 p-2.5 bg-primary-light/10 rounded-md" />,
        badgeText: "Smart",
        title: "AI Sökassistent",
        description: "Säkra signeringar med BankID och automatiserade juridiska dokument",
        details: [
            "Personliga tips",
            "Lärandealgoritm",
            "Endast för medlemmar"
        ]
    },
]

const About = () => {
    return (
        <div className="bg-gradient-to-b from-nordic-ice to-background">
            <div className="container mx-auto max-w-7xl py-16 px-6 @lg:px-8 @8xl:px-0">
                <h1 className="text-center text-4xl @4xl:text-6xl font-semibold tracking-tight mb-6">
                    Bostadsvyn
                </h1>
                <p className="text-center text-muted-foreground text-lg @lg:text-xl max-w-4xl mx-auto leading-relaxed mb-8">
                    Välkommen till framtidens bostadsportal med det bredaste utbudet av bostäder i Sverige. 
                    Hos oss hittar du allt från 
                    <span className="font-semibold text-foreground"> villor</span>,  
                    <span className="font-semibold text-foreground"> gårdar</span>,
                    <span className="font-semibold text-foreground"> lägenheter</span>,
                    <span className="font-semibold text-foreground"> tomter</span> och
                    <span className="font-semibold text-foreground"> fritidshus</span> till 
                    <span className="font-semibold text-foreground"> radhus</span>,
                    <span className="font-semibold text-foreground"> kedjehus</span>,
                    <span className="font-semibold text-foreground"> parhus</span>,
                    <span className="font-semibold text-foreground"> hyresbostäder</span>,
                    <span className="font-semibold text-foreground"> nyproduktion</span> och
                    <span className="font-semibold text-foreground"> kommersiella fastigheter</span> 
                    – allt på samma plattform.
                </p>
                <p className="text-center text-muted-foreground text-base @lg:text-lg max-w-4xl mx-auto leading-relaxed mb-20">
                    Vår vision är att revolutionera bostadsmarknaden genom att kombinera cutting-edge 
                    AI-teknologi med personlig service och rådgivning. Vi är här för att hjälpa dig genom 
                    hela processen och göra din största affär till en trygg och smidig upplevelse – oavsett 
                    om du köper, säljer eller hyr. 
                </p>

                <div className="flex justify-center mb-4">
                    <div className="flex items-center space-x-1.5 bg-primary py-2 px-4 rounded-full">
                        <SparklesIcon size={16} className="text-primary-foreground" /> 
                        <div className="text-xs font-semibold text-primary-foreground">
                            AI-Powered Features
                        </div>
                    </div>
                </div>

                <h2 className="text-center text-3xl @4xl:text-5xl font-semibold tracking-tight mb-6">
                    Revolutionerande fastighetsteknologi
                </h2>
                <p className="text-center text-muted-foreground text-lg @lg:text-xl max-w-3xl mx-auto leading-relaxed mb-12">
                    Vi kombinerar artificiell intelligens med djup marknadskunskap för att skapa den mest avancerade 
                    bostadsplattformen i Norden. Vår vision är att hjälpa alla parter på bästa möjliga sätt och med 
                    de verktygen vi har tagit fram är vi säkra på att vi kan just det. Läs mer nedan!
                </p>
                
                <div className="space-y-16 mb-16">
                    {highlights.map((highlight) => (
                        <Card key={highlight.badgeText} className="border-none p-0 bg-card overflow-hidden">
                            <CardContent className="p-0">
                                <div className="pt-8 @lg:pt-12 pb-12 @lg:pb-16 px-8 @lg:px-10 @4xl:px-12">
                                    <div className="inline-flex items-center space-x-1.5 bg-primary py-2 px-4 rounded-full mb-4">
                                        {highlight.badgeIcon}
                                        <div className="text-xs font-semibold text-primary-foreground">
                                            {highlight.badgeText}
                                        </div>
                                    </div>

                                    <h3 className="text-xl @lg:text-3xl font-semibold tracking-tight mb-4">{highlight.title}</h3>
                                    <p className="text-muted-foreground text-base @lg:text-lg leading-relaxed mb-6">{highlight.description}</p>

                                    <ul className="list-disc list-inside marker:text-primary marker:text-xl space-y-1">
                                        {highlight.details.map((detail, index) => (
                                            <li className="text-sm @lg:text-base" key={`${highlight.badgeText}-detail-${index}`}>{detail}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="grid grid-cols-1 @6xl:grid-cols-2">
                                    <div className="relative h-60 @lg:h-96 @2xl:h-96 @4xl:h-[500px] @6xl:h-[430px]">
                                        <Image
                                            src={highlight.imageBefore}
                                            alt={highlight.imageBeforeAlt}
                                            fill
                                            className="object-cover"
                                        />

                                        <div className="absolute top-4 left-4 @lg:top-5 @lg:left-5 text-sm bg-background/90 px-4 py-1 rounded-full shadow-sm">
                                            Före
                                        </div>
                                    </div>
                                    <div className="relative h-60 @lg:h-96 @4xl:h-[500px] @6xl:h-[430px]">
                                        <Image
                                            src={highlight.imageAfter}
                                            alt={highlight.imageAfterAlt}
                                            fill
                                            className="object-cover"
                                        />

                                        <div className="absolute top-4 right-4 @lg:top-5 @lg:right-5 text-sm text-primary-foreground bg-primary/90 px-4 py-1 rounded-full shadow-sm">
                                            Efter
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 @2xl:grid-cols-2 @6xl:grid-cols-3 auto-rows-min gap-6">
                    {features.map((feature, index) => (
                        <Link key={`card-${index}`} href={feature.href}>
                            <Card className="border-none p-0 bg-card overflow-hidden group hover:shadow-lg hover:scale-105 transition-all duration-300 h-full">
                                <CardContent className="p-0 h-full flex flex-col">
                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="flex items-center gap-x-4 mb-4">
                                            {feature.badgeIcon}
                                            {feature.badgeText && (
                                                <div className="text-xs text-primary-deep font-medium bg-primary/20 px-3 py-1 rounded-full">{feature.badgeText}</div>
                                            )}
                                        </div>
                                    
                                        <h4 className="text-xl group-hover:text-primary font-semibold mb-3">{feature.title}</h4>
                                        <p className="text-muted-foreground mb-4">{feature.description}</p>

                                        <ul className="list-disc list-inside marker:text-primary marker:text-xl space-y-1 mb-6">
                                            {feature.details.map((detail, index) => (
                                                <li key={`card-detail-${index}`} className="text-sm text-muted-foreground">{detail}</li>    
                                            ))}
                                        </ul>

                                        <div className="flex justify-center mt-auto">
                                            <div className="text-primary flex items-center gap-x-1 group-hover:underline underline-offset-3">
                                                Läs mer 
                                                <ArrowRightIcon size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default About