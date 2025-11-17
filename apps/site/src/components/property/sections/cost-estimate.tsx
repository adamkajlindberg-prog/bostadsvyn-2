import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const CostEstimate = () => {
    return (
        <Card className="py-6 shadow-xs">
            <CardContent className="px-6">
                <div className="text-xl @lg:text-2xl font-semibold tracking-tight mb-4">
                    Kostnadskalkyl för fastighet
                </div>
                
                <div className="flex flex-wrap justify-between gap-1 text-sm mb-1.5">
                    <div className="text-muted-foreground">Köpeskilling</div>
                    <div className="font-semibold">18 500 000 kr</div>
                </div>

                <div className="flex flex-wrap justify-between gap-1 text-sm">
                    <div className="text-muted-foreground">Driftskostnad</div>
                    <div className="font-semibold">8 500 kr/mån</div>
                </div>
                
                <div className="py-3 my-3 border-y">
                    <div className="text-sm font-semibol mb-1.5">Engångskostnader (uppskattning)</div>
                    <div className="flex flex-wrap justify-between gap-1 text-sm text-muted-foreground mb-1.5">
                        <div className="text-muted-foreground">Lagfart (1,5%)</div>
                        <div className="">277 500 kr</div>
                    </div>
                    <div className="flex flex-wrap justify-between gap-1 text-sm text-muted-foreground mb-1.5">
                        <div className="text-muted-foreground">Pantbrev (2%)</div>
                        <div className="">370 000 kr</div>
                    </div>
                    <div className="flex flex-wrap justify-between gap-1 text-sm text-muted-foreground mb-1.5">
                        <div className="text-muted-foreground">Fastighetsbesiktning</div>
                        <div className="">~12 000 kr</div>
                    </div>
                    <div className="flex flex-wrap justify-between gap-1 text-sm text-muted-foreground mb-1.5">
                        <div className="text-muted-foreground">Flytt</div>
                        <div className="">~15 000 kr</div>
                    </div>
                </div>
                
                <div className="flex flex-wrap justify-between font-semibold mb-3 gap-2">
                    <div>Total engångskostnad</div>
                    <div>674 500 kr</div>   
                </div>

                <div className="bg-primary/10 text-muted-foreground text-xs p-3.5 rounded-md mb-3">
                    Detta är en uppskattning för fastighetsköp. Faktiska kostnader kan variera beroende på 
                    fastighetens storlek och läge.
                </div>

                <Button size="lg" className="w-full">
                    Fullständig kalkyl
                </Button>
            </CardContent>
        </Card>
    )
}

export default CostEstimate