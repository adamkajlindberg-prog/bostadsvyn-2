import { Card, CardContent } from "@/components/ui/card"
import { BriefcaseIcon } from "lucide-react"

const stats = [
    {
        title: "Kommersiella objekt",
        value: "8,450"
    },
    {
        title: "Tillgänglig yta",
        value: "1,2M m²"
    },
    {
        title: "Aktiva mäklare",
        value: "340"
    },
    {
        title: "Klientnöjdhet",
        value: "94%"
    }
]


const Hero = () => {
    return (
        <>
            <div className="flex items-center justify-center flex-wrap gap-4 mb-4">
                <div className="bg-primary text-primary-foreground rounded-md p-3">
                    <BriefcaseIcon className="h-6 w-6 @lg:h-8 @lg:w-8" />
                </div>
                <div className="bg-primary text-xs text-primary-foreground rounded-full px-3 py-1.5">Professionella lösningar</div>
            </div>

            <h1 className="text-4xl @lg:text-5xl text-primary text-center font-semibold tracking-tight leading-tight mb-4">Kommersiella fastigheter</h1>
            <p className="text-lg @lg:text-xl text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
                Hitta den perfekta kommersiella fastigheten för ditt företag. Från moderna kontor och strategiskt placerade butiker till industrilokaler och investeringsobjekt.
            </p>

            <div className="grid grid-cols-1 @lg:grid-cols-2 @5xl:grid-cols-4 gap-6 mb-12">
                {stats.map((stat) => (
                    <Card key={stat.title} className="py-6 shadow-xs">
                        <CardContent className="px-6">
                            <div className="text-3xl text-primary text-center font-bold mb-2">{stat.value}</div>
                            <div className="text-sm text-muted-foreground text-center">{stat.title}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default Hero