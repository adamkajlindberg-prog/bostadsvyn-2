import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BriefcaseIcon } from "lucide-react"

const BrowseCommercials = () => {
    return (
        <Card className="py-8 bg-primary-deep border-none shadow-none">
            <CardContent className="px-6">
                <h2 className="text-2xl @lg:text-3xl text-center text-primary-foreground font-semibold mb-4">Hitta din nästa affärsmöjlighet</h2>
                <p className="text-sm @lg:text-base text-primary-foreground/90 text-center max-w-2xl mx-auto mb-8">
                    Våra specialister inom kommersiella fastigheter hjälper dig att hitta den perfekta lokalen eller investeringen för ditt företag.
                </p>
                <div className="flex flex-col @lg:flex-row gap-4 justify-center">
                    <Button variant="outline" className="text-sm @lg:text-base py-6 hover:border-transparent w-full @lg:w-auto"><BriefcaseIcon /> Kontakta specialist</Button>
                    <Button variant="outline" className="text-sm @lg:text-base py-6 hover:border-transparent w-full @lg:w-auto">Se alla objekt</Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default BrowseCommercials