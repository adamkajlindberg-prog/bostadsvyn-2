import { CircleCheck, CrownIcon, StarIcon, TrendingUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const plans = [
  {
    icon: <StarIcon size={18} />,
    name: "Grundpaket",
    price: 0,
    description:
      "Perfekt för alla som vill annonsera sin fastighet kostnadsfritt",
    features: [
        {
            name: "Grundläggande annons",
            description: "Standard storlek på annons"
        },
        {
            name: "Enkel publicering",
            description: "Lägg ut din fastighet på plattformen"
        },
        {
            name: "Synlighet i sökresultat",
            description: "Din annons visas i vanliga sökningar"
        },
    ],
    buttonIsDisabled: true,
    buttonText: "Nuvarande paket",
  },
  {
    icon: <TrendingUpIcon size={18} />,
    name: "Pluspaket",
    price: 1495,
    isRecommended: true,
    description:
      "Större annons med månatlig förnyelse. Hamnar över Grundpaketet i publiceringslistan",
    features: [
        {
            name: "Större annons",
            description: "Din annons får mer utrymme och syns bättre"
        },
        {
            name: "Prioriterad placering",
            description: "Hamnar över Grundpaketet i publiceringslistan"
        },
        {
            name: "Månatlig förnyelse",
            description: "Förnya annonsen varje månad kostnadsfritt"
        },
        {
            name: "Fler bilder",
            description: "Visa upp till 15 bilder"
        },
        {
            name: "Utökad beskrivning",
            description: "Mer plats för detaljerad beskrivning"
        },
    ],
    buttonIsDisabled: false,
    buttonText: "Uppgradera till Plus",
    footerText: "Förnyelse varje månad kostnadsfritt",
    isPopular: true,
  },
  {
    icon: <CrownIcon size={18} />,
    name: "Exklusivpaket",
    price: 2995,
    description:
      "Störst annons med AI-verktyg. Förnyelse var 3:e vecka. Hamnar högst i publiceringslistan",
    features: [
        {
            name: "Störst annons",
            description: "Maximal storlek och synlighet"
        },
        {
            name: "Högsta prioritet",
            description: "Hamnar högst i publiceringslistan över alla andra"
        },
        {
            name: "AI-bildredigering",
            description: "AI-verktyg för professionell bildredigering ingår"
        },
        {
            name: "Snabb förnyelse",
            description: "Förnya annonsen var 3:e vecka"
        },
        {
            name: "Utvalda sektionen",
            description: `Visas i "Utvalda fastigheter"`
        },
        {
            name: "Obegränsat med bilder",
            description: "Visa hur många bilder du vill"
        },
        {
            name: "Avancerad analys",
            description: "Detaljerad statistik och insikter"
        },
        {
            name: "Prioriterad support",
            description: "Snabb och dedikerad hjälp"
        }
    ],
    buttonIsDisabled: false,
    buttonText: "Uppgradera till Exklusiv",
    footerText: "AI-bildredigering ingår • Förnyelse var 3:e vecka"
  },
];

const PricingPlans = () => {
    return (
        <>
            <h2 className="text-2xl @lg:text-3xl text-center font-semibold mb-4">Välj ditt annonspaket</h2>
            <p className="text-base @lg:text-lg text-center text-muted-foreground max-w-2xl mx-auto mb-8 @4xl:mb-10 @5xl:mb-12">
                Öka din fastighets synlighet och nå fler potentiella köpare med våra premium annonsnivåer.
            </p>

            <div className="mx-auto grid grid-cols-1 @4xl:grid-cols-2 @5xl:grid-cols-3 auto-rows-min items-stretch gap-4">
                {plans.map((plan) => (
                <div
                    key={plan.name}
                    className={cn("relative border rounded-lg p-6 shadow-xs", {
                    "border-2 border-primary py-6 mt-1 @4xl:mt-0 @5xl:-mt-3 @5xl:-mb-3": plan.isPopular,
                    })}
                >
                    {plan.isPopular && (
                    <Badge className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
                        Mest populär
                    </Badge>
                    )}
                    <h3 className="text-lg font-semibold flex justify-between items-center">
                        {plan.name}
                        {plan.icon}
                    </h3>
                    <p className="mt-2 text-4xl font-semibold">{plan.price} <span className="text-lg text-muted-foreground font-normal">SEK</span></p>
                    <p className="mt-4 text-sm text-muted-foreground">
                    {plan.description}
                    </p>
                    <Separator className="my-4" />
                    <ul className="space-y-2">
                    {plan.features.map((feature) => (
                        <li key={feature.name} className="flex items-start gap-2">
                        <CircleCheck className="h-4 w-4 mt-0.5 text-green-600" />
                        <div>
                            <div className="text-sm font-medium mb-1">{feature.name}</div>
                            <div className="text-xs text-muted-foreground">{feature.description}</div>
                        </div>
                        </li>
                    ))}
                    </ul>
                    <Button
                    variant={plan.name === "Grundpaket" ? "outline" : "default"}
                    size="lg"
                    className="w-full mt-6 mb-4"
                    disabled={plan.buttonIsDisabled}
                    >
                    {plan.buttonText}
                    </Button>
                    <div className="text-xs text-center text-muted-foreground">{plan.footerText}</div>
                </div>
                ))}
            </div>
        </>
    )
}

export default PricingPlans