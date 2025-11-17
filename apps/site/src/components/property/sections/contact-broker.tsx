import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, MessageSquareIcon } from "lucide-react"

const ContactBroker = () => {
    return (
        <Card className="py-6 shadow-xs">
            <CardContent className="px-6">
                <div className="text-xl @lg:text-2xl font-semibold tracking-tight mb-4">
                    Kontakta mäklaren
                </div>

                <Button size="lg" className="w-full mb-3">
                    <MessageSquareIcon />
                    Skicka meddelande
                </Button>

                    <Button variant="outline" size="lg" className="w-full">
                    <CalendarIcon />
                    Boka visning
                </Button>
            </CardContent>
        </Card>
    )
}

export default ContactBroker