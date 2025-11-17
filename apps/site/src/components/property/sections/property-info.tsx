import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BathIcon, BedDoubleIcon, HeartIcon, HouseIcon, MapPinIcon, RulerIcon, Share2Icon, WandSparklesIcon } from "lucide-react"
import Link from "next/link"

const specs = [
    {
        icon: <RulerIcon className="h-5 w-5 @lg:h-6 @lg:w-6" />,
        value: "285 m²",
        label: "Boarea"
    },
    {
        icon: <HouseIcon className="h-5 w-5 @lg:h-6 @lg:w-6"  />,
        value: "8 rum",
        label: "Antal rum"
    },
    {
        icon: <BedDoubleIcon className="h-5 w-5 @lg:h-6 @lg:w-6" />,
        value: "5",
        label: "Sovrum"
    },
    {
        icon: <BathIcon className="h-5 w-5 @lg:h-6 @lg:w-6" />,
        value: "3",
        label: "Badrum"
    },
]

const PropertyInfo = () => {
    return (
        <Card className="py-6 shadow-xs">
            <CardContent className="px-6">
                <div className="flex flex-col @4xl:flex-row @4xl:justify-between items-start mb-6 gap-6">
                    <div className="order-2 @4xl:order-1">
                        <h3 className="order-2 text-xl @lg:text-2xl font-semibold tracking-tight mb-1.5">
                            Exklusiv villa med havsutsikt
                        </h3>
                        <div className="flex items-start text-muted-foreground gap-1.5">
                            <MapPinIcon className="mt-0.5 @lg:mt-[3px] h-4 w-4 lg:h-[18px] lg:w-[18px]" />
                            <div className="text-sm @lg:text-base">Strandvägen 42, 182 68 Djursholm</div>
                        </div>
                    </div>

                    <div className="order-1 @4xl:order-2 flex flex-wrap self-start @lg:self-end @4xl:self-start gap-2">
                        <Button variant="outline">
                            <HeartIcon />
                        </Button>
                        <Button variant="outline">
                            <Share2Icon />
                        </Button>
                        <Link href="/ai-bildredigering">
                            <Button variant="ghost" className="text-sm font-medium bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white border-0">
                                <WandSparklesIcon /> AI Renovering
                            </Button>
                        </Link>
                    </div>
                </div>                

                <div className="text-2xl @lg:text-3xl text-primary font-bold mb-0.5">18 500 000 kr</div>
                <div className="text-sm text-muted-foreground mb-8">+ 8 500 kr/månad</div>
                
                <div className="grid grid-cols-2 @lg:grid-cols-4 gap-6 @lg:gap-4 border-b pb-6">
                    {specs.map((spec, index) => (
                        <div key={`property-spec-${index}`} className="flex flex-col items-center">
                            <div className="text-muted-foreground mb-2">{spec.icon}</div>
                            <div className="text-sm @lg:text-base font-semibold">{spec.value}</div>
                            <div className="text-xs @lg:text-sm text-muted-foreground">{spec.label}</div>
                        </div>
                    ))}
                </div>

                <div className="py-6 border-b">
                    <div className="font-semibold mb-3">Beskrivning</div>
                    <p className="text-sm @lg:text-base text-muted-foreground">
                        Magnifik villa i absolut toppskick med panoramautsikt över havet. Genomgående exklusiva materialval, 
                        rymliga sällskapsytor och perfekt planlösning för familjen som värdesätter kvalitet och komfort.
                    </p>
                </div>

                <div className="py-6">
                    <div className="font-semibold mb-3">Fastighetsinformation</div>
                    <div className="grid grid-cols-1 @lg:grid-cols-2 gap-x-14 gap-y-2">
                        <div className="flex justify-between">
                            <div className="text-sm text-muted-foreground">Fastighetstyp:</div>
                            <div className="text-sm">Villa</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-sm text-muted-foreground">Publicerad:</div>
                            <div className="text-sm">2025-10-22</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-sm text-muted-foreground">Uppdaterad:</div>
                            <div className="text-sm">2025-10-22</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default PropertyInfo