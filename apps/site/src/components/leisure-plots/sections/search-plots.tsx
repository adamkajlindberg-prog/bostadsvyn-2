import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CompassIcon, FunnelIcon, MapPinIcon } from "lucide-react"

const types = [
  { value: "holiday-house", label: "Fritidshus" },
  { value: "plot", label: "Tomt" },
  { value: "cabin", label: "Stuga" },
  { value: "farm", label: "Gård" },
]

const environments = [
  { value: "coastal", label: "Havsnära" },
  { value: "forest", label: "Skog" },
  { value: "mountain", label: "Fjäll" },
  { value: "lakeside", label: "Sjönära" },
]

const priceRanges = [
  { value: "under-500k", label: "Under 500k" },
  { value: "500k-1m", label: "500k - 1M" },
  { value: "1m-2m", label: "1M - 2M" },
  { value: "over-2m", label: "Över 2M" },
]

const SearchPlots = () => {
    return (
        <Card className="py-6 shadow-xs mb-8">
            <CardContent className="px-6">
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <FunnelIcon size={20} />
                    <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">Sök fritidsbostad eller tomt</h3>
                </div>

                <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-4 gap-4 mb-7">
                    <div>
                        <Label className="text-sm font-medium mb-2">Område</Label>
                        <Input type="text" className="text-sm" placeholder="Skärgård, Småland, Dalarna..." />
                    </div>

                    <div>
                        <Label className="text-sm font-medium mb-2">Typ</Label>
                            <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Välj typ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {types.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm font-medium mb-2">Miljö</Label>
                            <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Välj miljö" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {environments.map((environment) => (
                                        <SelectItem key={environment.value} value={environment.value}>
                                            {environment.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm font-medium mb-2">Prisintervall</Label>
                            <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Välj pris" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {priceRanges.map((priceRange) => (
                                        <SelectItem key={priceRange.value} value={priceRange.value}>
                                            {priceRange.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex flex-col @lg:flex-row gap-4">
                    <Button size="lg">
                        <CompassIcon />
                        Sök fastigheter
                    </Button>

                    <Button size="lg" variant="outline">
                        <MapPinIcon />
                        Visa på karta
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default SearchPlots