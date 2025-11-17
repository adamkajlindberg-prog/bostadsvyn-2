import { Card, CardContent } from "@/components/ui/card"

const SimilarProperties = () => {
    return (
        <Card className="py-6 shadow-xs">
            <CardContent className="px-6">
                <div className="text-xl @lg:text-2xl font-semibold tracking-tight mb-4">
                    Liknande fastigheter
                </div>
                
                <div className="text-muted-foreground text-center text-sm @lg:text-base">Kommer snart...</div>
            </CardContent>
        </Card>
    )
}

export default SimilarProperties