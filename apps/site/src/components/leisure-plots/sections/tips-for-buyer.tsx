import { Card, CardContent } from "@/components/ui/card"

const tips = [
    {
        title: "Innan du köper",
        items: [
            "Kontrollera bygglov och markförhållanden",
            "Undersök tillgång till el, vatten och avlopp",
            "Kolla vägtillgång och snöröjning",
            "Verifiera allemansrättsliga begränsningar"
        ]
    },
    {
        title: "Ekonomiska aspekter",
        items: [
            "Budgetera för underhåll och renovering",
            "Kontrollera fastighetsavgift och taxering",
            "Undersök föreningsavgifter om tillämpligt",
            "Tänk på försäkringar och säsongsboende"
        ]
    },
]

const TipsForBuyer = () => {
    return (
        <Card className="py-6 mb-12 shadow-xs bg-gradient-to-br from-accent/5 to-success/5">
            <CardContent className="px-6">
                <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight mb-6">Tips för fritidshusköpare</h3>

                <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-6">
                    {tips.map((tip) => (
                        <div key={tip.title}>
                            <div className="font-semibold mb-2">{tip.title}</div>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                {tip.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                    </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default TipsForBuyer