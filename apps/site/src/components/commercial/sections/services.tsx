import { Card, CardContent } from "@/components/ui/card"
import { BriefcaseIcon, TrendingUpIcon, UsersIcon } from "lucide-react"

const services = [
    {
        icon: <TrendingUpIcon size={30} />,
        title: "Marknadsvärdering",
        description: "Professionella värderingar av kommersiella fastigheter"
    },
    {
        icon: <UsersIcon size={30} />,
        title: "Rådgivning",
        description: "Specialiserade mäklare för kommersiella transaktioner"
    },
    {
        icon: <BriefcaseIcon size={30} />,
        title: "Portföljhantering",
        description: "Hjälp med att bygga och optimera fastighetsportföljer"
    },
]

const Services = () => {
    return (
        <Card className="py-6 mb-12 shadow-xs bg-gradient-to-br from-primary/5 to-success/5">
            <CardContent className="px-6">
                <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight mb-6">Hjälp med att bygga och optimera fastighetsportföljer</h3>

                <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={`step-${index + 1}`}>
                            <div className="flex justify-center mb-4">
                                <div className="inline-flex bg-accent/10 rounded-full p-4 text-primary">
                                    {service.icon}
                                </div>
                            </div>
                            <h5 className="text-base text-center font-semibold mb-2">{service.title}</h5>
                            <p className="text-sm text-center text-muted-foreground">{service.description}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default Services