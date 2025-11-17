import { CameraIcon, CircleCheckBigIcon, CoinsIcon, PlusIcon, SearchIcon, SparklesIcon, StarIcon, TrendingUpIcon, UserCheckIcon, UsersIcon, ZapIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const highlights = [
    {
        icon: <TrendingUpIcon size={32} />,
        title: "+15% högre pris",
        description: "i genomsnitt med våra AI-verktyg"
    },
    {
        icon: <ZapIcon size={32} />,
        title: "45% snabbare",
        description: "försäljning med optimerade annonser"
    },
    {
        icon: <UsersIcon size={32} />,
        title: "2,400+ mäklare",
        description: "certifierade partners på plattformen"
    },
    {
        icon: <StarIcon size={32} />,
        title: "4.9/5 betyg",
        description: "från nöjda säljare"
    }
]

const sellingSteps = [
    {
        icon: <CoinsIcon />,
        title: "Värdera din bostad",
        description: "Få en kostnadsfri värdering på 1 minut baserat på aktuella marknadsdata"
    },
    {
        icon: <UserCheckIcon />,
        title: "Hitta rätt mäklare",
        description: "Få skräddarsydda rekommendationer baserat på ditt område, bostadstyp och mäklarnas rekommendationer och resultat"
    },
    {
        icon: <CameraIcon />,
        title: "Mäklaren skapar annons",
        description: "Din mäklare publicerar annonsen med alla optimeringar och hanterar försäljningen via våra smarta konton"
    },
    {
        icon: <SparklesIcon />,
        title: "Direkt marknadsföring",
        description: "Som säljare kan du via ditt konto själv publicera ditt objekt via våra marknadskanaler för att nå fler spekulanter"
    },
    {
        icon: <TrendingUpIcon />,
        title: "Uppnå högsta pris",
        description: "Följ intresse, statistik och sälj till bästa möjliga slutpris med hjälp av våra smarta paket"
    },
]

const brokerFeatures = [
    {
        title: "Certifierade experter",
        description: "Alla mäklare är licenserade och har dokumenterad erfarenhet",
    },
    {
        title: "AI-förstärkta verktyg",
        description: "Mäklarna får tillgång till våra kraftfulla AI-verktyg för homestyling och prissättning",
    },
    {
        title: "Resultatbaserade rekommendationer",
        description: "Vi matchar dig med mäklare baserat på deras rekommendationer och track record i ditt område",
    },
]

const Hero = () => {
    return (
        <>
            <div className="flex items-center justify-center flex-wrap gap-4 mb-4">
                <div className="bg-primary text-primary-foreground rounded-md p-3">
                    <PlusIcon className="h-6 w-6 @lg:h-8 @lg:w-8" />
                </div>
                <div className="bg-primary text-xs text-primary-foreground rounded-full px-3 py-1.5">AI-assisterad försäljning</div>
            </div>

            <h1 className="text-4xl @lg:text-5xl text-primary text-center font-semibold tracking-tight leading-tight mb-4">Sälj din bostad smart</h1>
            <p className="text-lg @lg:text-xl text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
                Maximera värdet på din bostad med AI-drivna verktyg och Sveriges bästa mäklare. Vi ger dig verktygen och kopplar dig till rätt mäklare 
                för att uppnå högsta möjliga slutpris.
            </p>

            <div className="grid grid-cols-1 @lg:grid-cols-2 @5xl:grid-cols-4 gap-6 mb-10">
                {highlights.map((highlight) => (
                    <Card key={highlight.title} className="py-6 shadow-xs">
                        <CardContent className="px-6">
                            <div className="flex justify-center mb-4">
                                <div className="inline-flex bg-accent/10 rounded-full p-4 text-primary">
                                    {highlight.icon}
                                </div>
                            </div>
                            <h5 className="text-base text-center font-semibold mb-2">{highlight.title}</h5>
                            <p className="text-sm text-center text-muted-foreground">{highlight.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="py-6 mb-10 shadow-xs">
                <CardContent className="px-6">
                    <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight mb-2">Så här säljer du smartast med Bostadsvyn</h3>
                    <p className="text-muted-foreground mb-6">
                        Vi kombinerar kraftfulla AI-verktyg med professionella mäklares expertis för att säkerställa 
                        att du uppnår högsta möjliga slutpris
                    </p>

                    <div className="grid grid-cols-1 @lg:grid-cols-3 @8xl:grid-cols-5 gap-8">
                        {sellingSteps.map((step, index) => (
                            <div key={`step-${index + 1}`}>
                                <div className="flex justify-center mb-4">
                                    <div className="inline-flex bg-accent/10 rounded-full p-4 text-primary">
                                        {step.icon}
                                    </div>
                                </div>
                                <h5 className="text-base text-center font-semibold mb-2">{step.title}</h5>
                                <p className="text-sm text-center text-muted-foreground">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="py-6 bg-gradient-to-br from-primary/5 to-success/5 mb-12 shadow-xs">
                <CardContent className="px-6">
                    <div className="flex @lg:items-center flex-wrap mb-6 gap-4 @lg:gap-2">
                        <UserCheckIcon className="text-primary" />
                        <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">Professionella mäklare som gör skillnad</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                        På Bostadsvyn kan endast certifierade mäklare publicera försäljningsannonser. Detta säkerställer kvalitet, 
                        juridisk säkerhet och att du får professionell support genom hela processen. Våra AI-verktyg fungerar som 
                        kraftfulla hjälpmedel som mäklaren använder för att maximera värdet på din bostad.
                    </p>

                    <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 gap-8 mb-6">
                        {brokerFeatures.map((item, i) => (
                            <div key={i} className="flex items-start gap-1">
                                <div className="flex-shrink-0 text-primary rounded-full p-2">
                                    <CircleCheckBigIcon size={18} />
                                </div>
                                <div className="mt-1">
                                    <div className="font-semibold mb-1">{item.title}</div>
                                    <div className="text-sm text-muted-foreground">{item.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button size="lg"><SearchIcon /> Hitta din mäklare</Button>
                </CardContent>
            </Card>
        </>
    )
}

export default Hero