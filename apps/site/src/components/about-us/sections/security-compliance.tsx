import { Card, CardContent } from "@/components/ui/card"
import { CircleCheckIcon, EyeIcon, FileTextIcon, LockIcon, ShieldIcon, TriangleAlertIcon } from "lucide-react"

const items = [
    {
        icon: <ShieldIcon />,
        title: "BankID-verifiering",
        description: "Alla användare verifieras via svenskt BankID för maximal säkerhet och för att motverka bedrägerier och identitetsstöld."
    },
    {
        icon: <LockIcon />,
        title: "GDPR-kompatibel",
        description: "Fullständig efterlevnad av GDPR med krypterad datalagring, rätt till radering och transparent hantering av personuppgifter."
    },
    {
        icon: <CircleCheckIcon />,
        title: "Moderering",
        description: "Alla annonser granskas innan publicering för att säkerställa korrekt information och förhindra vilseledande marknadsföring."
    },
    {
        icon: <EyeIcon />,
        title: "Säkerhetsloggning",
        description: "Alla säkerhetshändelser loggas och övervakas kontinuerligt för att snabbt kunna upptäcka och åtgärda eventuella hot."
    },
    {
        icon: <TriangleAlertIcon />,
        title: "Incidenthantering",
        description: "Strukturerad process för rapportering och hantering av säkerhetsincidenter, bedrägerier och regelbrott."
    },
    {
        icon: <FileTextIcon />,
        title: "DAC7-rapportering",
        description: "Automatisk efterlevnad av EU:s DAC7-direktiv för rapportering av hyresintäkter till Skatteverket."
    }
]

const SecurityCompliance = () => {
    return (
        <>
            <h2 className="text-2xl @lg:text-3xl text-center font-semibold mb-3">Säkerhet & Efterlevnad</h2>
            <p className="text-sm @lg:text-base text-center text-muted-foreground max-w-2xl mx-auto mb-10">
                Din säkerhet och integritet är vår högsta prioritet. Vi följer alla relevanta lagar 
                och arbetar kontinuerligt för att skydda dina uppgifter.
            </p>

            <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-6 mb-14">
                {items.map((item) => (
                    <Card key={item.title} className="py-6 shadow-xs">
                        <CardContent className="px-6">
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <div className="inline-flex bg-accent/10 rounded-full p-2 text-primary">
                                    {item.icon}
                                </div>
                                <div className="text-base @lg:text-lg font-semibold">{item.title}</div>
                            </div>
                            <p className="text-sm @lg:text-base text-muted-foreground">{item.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default SecurityCompliance