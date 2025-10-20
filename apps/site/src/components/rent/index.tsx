import { HouseIcon, MessageCircleIcon, PlusIcon, UsersIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Rentals from "./rentals"
import { Card, CardContent } from "@/components/ui/card"

const otherInfo = [
    {
        icon: <MessageCircleIcon className="text-primary" />,
        title: "Säker kommunikation",
        description: "Chatta säkert med uthyraren genom vår plattform. Alla konversationer sparas för transparens och säkerhet."
    },
    {
        icon: <UsersIcon className="text-primary" />,
        title: "Juridiska hyresavtal",
        description: "När ni kommit överens hjälper vi er med juridiskt korrekta hyresavtal som kan signeras digitalt med BankID."
    },
]

const Rent = () => {
    return (
        <div className="@container">
            <div className="container mx-auto max-w-7xl px-6 @lg:px-8 @8xl:px-0 py-10">
                <div className="flex justify-center mb-6">
                    <div className="inline-flex items-center bg-primary/10 text-sm text-primary rounded-full px-3 py-1.5 gap-x-2">
                        <HouseIcon size={18} />
                        Hyresbostäder
                    </div>
                </div>

                <h1 className="text-4xl @lg:text-5xl text-center font-semibold tracking-tight mb-4">Hitta din perfekta <span className="text-primary">hyresbostad</span></h1>
                <p className="text-lg @lg:text-xl text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                    Bläddra bland tusentals bostäder att hyra. Kontakta uthyraren direkt genom vår säkra chattfunktion.
                </p>

                <div className="flex justify-center mb-12">
                    <Button size="lg" className="text-base py-6 w-56"><PlusIcon /> Skapa hyresannons</Button>
                </div>
                
                <Rentals />

                <div className="grid grid-cols-1 @4xl:grid-cols-2 gap-8 mt-12">
                    {otherInfo.map((info) => (
                        <Card key={info.title} className="py-6 shadow-none">
                            <CardContent className="px-6">
                                <div className="flex items-center gap-2.5 mb-4">
                                    {info.icon}
                                    <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">{info.title}</h3>
                                </div>
                                <p className="text-sm @lg:text-base text-muted-foreground">{info.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Rent