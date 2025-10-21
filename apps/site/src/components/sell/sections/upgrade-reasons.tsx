import { Card, CardContent } from "@/components/ui/card"
import { CrownIcon, TrendingUpIcon, ZapIcon } from "lucide-react"

const reasons = [
    {
        icon: <TrendingUpIcon size={30} />,
        title: "Ökad synlighet",
        description: "Få upp till 10x fler visningar med premium-placering och utvalda annonser"
    },
    {
        icon: <ZapIcon size={30} />,
        title: "Snabbare försäljning",
        description: "Fastigheter med premiumannonser säljs 40% snabbare än standardannonser"
    },
    {
        icon: <CrownIcon size={30} />,
        title: "Professionella verktyg",
        description: "Tillgång till AI-drivna insikter, avancerad analys och marknadsföringsverktyg"
    },
]

const UpgradeReasons = () => {
    return (
        <Card className="py-6 shadow-xs mt-12">
            <CardContent className="px-6">
                <h3 className="text-xl @lg:text-2xl text-center font-semibold tracking-tight mb-6">Varför uppgradera?</h3>

                <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 gap-8">
                    {reasons.map((reason) => (
                        <div key={reason.title}>
                            <div className="flex justify-center mb-4">
                                <div className="text-primary">
                                    {reason.icon}
                                </div>
                            </div>
                            <h5 className="text-base text-center font-semibold mb-2">{reason.title}</h5>
                            <p className="text-sm text-center text-muted-foreground">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default UpgradeReasons