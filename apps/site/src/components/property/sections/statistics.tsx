import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, EyeIcon, HeartIcon } from "lucide-react"

const Statistics = () => {
    return (
        <Card className="py-6 shadow-xs">
            <CardContent className="px-6">
                <div className="text-xl @lg:text-2xl font-semibold tracking-tight mb-4">
                    Statistik
                </div>
                
                <div className="flex justify-between text-sm mb-2">
                    <div className="inline-flex items-center gap-2"><EyeIcon size={16} /> Visningar</div>
                    <div className="font-semibold">-</div>
                </div>

                <div className="flex justify-between text-sm mb-2">
                    <div className="inline-flex items-center gap-2"><HeartIcon size={16} /> Favoriter</div>
                    <div className="font-semibold">-</div>
                </div>

                    <div className="flex justify-between text-sm">
                    <div className="inline-flex items-center gap-2"><CalendarIcon size={16} /> Dagar på marknaden</div>
                    <div className="font-semibold">0</div>
                </div>
            </CardContent>
        </Card>
    )
}

export default Statistics