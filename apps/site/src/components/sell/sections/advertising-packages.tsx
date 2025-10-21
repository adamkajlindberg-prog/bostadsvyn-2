import { Card, CardContent } from "@/components/ui/card"
import { BriefcaseBusinessIcon, ChartLineIcon, TargetIcon, TrendingUpIcon, ZapIcon } from "lucide-react"

const packages = [
    {
        icon: <ChartLineIcon />,
        title: "Högre slutpris",
        description: "Fastigheter annonserade med våra premium-paket och AI-verktyg får i genomsnitt 8-12% högre slutpris tack vare bättre presentation och bredare räckvidd."
    },
    {
        icon: <ZapIcon />,
        title: "Snabbare försäljning",
        description: "Premium-annonser säljs i genomsnitt 3 veckor snabbare tack vare prioriterad exponering och professionell presentation."
    },
    {
        icon: <TargetIcon />,
        title: "Rätt köpare",
        description: "Vår AI-matchning och smarta sökfunktioner säkerställer att din fastighet når de köpare som är mest intresserade."
    },
    {
        icon: <BriefcaseBusinessIcon />,
        title: "Professionell support",
        description: "Med premium-paketen får du tillgång till vårt expertteam som hjälper dig optimera din annons för maximalt resultat."
    },
]

const AdvertisingPackages = () => {
    return (
        <Card className="py-6 mt-8 shadow-xs">
            <CardContent className="px-6">
                <div className="flex @lg:items-center flex-wrap mb-4 gap-4 @lg:gap-2">
                    <TrendingUpIcon className="text-primary" />
                    <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">Varför välja våra annonspaket?</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-8">
                    Vi kombinerar modern teknologi med marknadskännedom för att ge dig bästa möjliga resultat
                </p>

                <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-8">
                    {packages.map((pkg) => (
                        <div key={pkg.title}>
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <div className="inline-flex bg-primary rounded-md p-2 text-primary-foreground">
                                    {pkg.icon}
                                </div>
                                <div className="text-base font-semibold">{pkg.title}</div>
                            </div>
                            <p className="text-sm text-muted-foreground">{pkg.description}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default AdvertisingPackages