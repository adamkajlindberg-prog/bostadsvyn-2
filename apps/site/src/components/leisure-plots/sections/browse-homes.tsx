import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TreePalmIcon } from "lucide-react"

const BrowseHomes = () => {
    return (
        <Card className="py-8 bg-primary-deep border-none shadow-none">
            <CardContent className="px-6">
                <h2 className="text-2xl @lg:text-3xl text-center text-primary-foreground font-semibold mb-4">Din drömfritidsbostad väntar</h2>
                <p className="text-sm @lg:text-base text-primary-foreground/90 text-center max-w-2xl mx-auto mb-8">
                    Börja din resa mot den perfekta tillflyktsorten. Vi hjälper dig att hitta fritidshus eller tomter som passar dina drömmar och budget.
                </p>
                <div className="flex flex-col @lg:flex-row gap-4 justify-center">
                    <Button variant="outline" className="text-sm @lg:text-base py-6 hover:border-transparent w-full @lg:w-auto"><TreePalmIcon /> Bläddra bland fritidshus</Button>
                    <Button variant="outline" className="text-sm @lg:text-base py-6 hover:border-transparent w-full @lg:w-auto">Sök byggklara tomter</Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default BrowseHomes