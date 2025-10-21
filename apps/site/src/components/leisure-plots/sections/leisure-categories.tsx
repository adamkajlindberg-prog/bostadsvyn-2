import { Card, CardContent } from "@/components/ui/card"
import { MountainIcon, SunIcon, TreesIcon, WavesIcon } from "lucide-react"

const categories = [
    {
        icon: <WavesIcon size={32} />,
        name: "Havsnära fritidshus",
        description: "Charmiga stugor vid svenska västkusten och skärgården",
        badgeText: "2,847 annonser"
    },
    {
        icon: <TreesIcon size={32} />,
        name: "Skogstomter",
        description: "Natursköna tomter i skog för ditt drömhus",
        badgeText: "4,123 annonser"
    },
    {
        icon: <MountainIcon size={32} />,
        name: "Fjällstugor",
        description: "Exklusiva stugor i Sveriges fjällvärd",
        badgeText: "892 annonser"
    },
    {
        icon: <SunIcon size={32} />,
        name: "Lantgårdar",
        description: "Större gårdar och egendomar för det gröna livet",
        badgeText: "567 annonser"
    }
]

const LeisureCategories = () => {
    return (
        <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-4 gap-6 mb-14">
            {categories.map((category) => (
                <Card key={category.name} className="py-6 shadow-xs border-primary/40">
                    <CardContent className="px-6">
                        <div className="flex justify-center mb-4">
                            <div className="inline-flex bg-accent/10 rounded-full p-4 text-primary">
                                {category.icon}
                            </div>
                        </div>

                        <h5 className="text-lg text-center font-semibold mb-2">{category.name}</h5>
                        <p className="text-sm text-center text-muted-foreground mb-4">{category.description}</p>
                        
                        <div className="flex justify-center">
                            <div className="bg-primary/10 text-xs text-center text-primary font-medium rounded-full px-3 py-1">{category.badgeText}</div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default LeisureCategories