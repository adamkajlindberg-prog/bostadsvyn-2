import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BriefcaseIcon, FunnelIcon, MapPinIcon } from "lucide-react"

const types = [
  { value: "office", label: "Kontor" },
  { value: "shop", label: "Butik/Handel" },
  { value: "warehouse", label: "Lager" },
  { value: "industrial", label: "Industri" },
  { value: "restaurant", label: "Restaurang" },
  { value: "hotel", label: "Hotell" },
]

const surfaces = [
  { value: "0-100", label: "0–100 m²" },
  { value: "100-500", label: "100–500 m²" },
  { value: "500-1000", label: "500–1000 m²" },
  { value: "over-1000", label: "Över 1000 m²" },
]

const actionTypes = [
  { value: "rent", label: "Hyra" },
  { value: "buy", label: "Köp" },
  { value: "both", label: "Båda" },
]

const SearchCommercial = () => {
    return (
        <Card className="py-6 shadow-xs mb-8">
            <CardContent className="px-6">
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <FunnelIcon size={20} />
                    <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">Sök kommersiella fastigheter</h3>
                </div>

                <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-4 gap-4 mb-7">
                    <div>
                        <Label className="text-sm font-medium mb-2">Område</Label>
                        <Input type="text" className="text-sm" placeholder="Skärgård, Småland, Dalarna..." />
                    </div>

                    <div>
                        <Label className="text-sm font-medium mb-2">Fastighetstyp</Label>
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
                        <Label className="text-sm font-medium mb-2">Yta (m²)</Label>
                            <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Välj yta" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {surfaces.map((surface) => (
                                        <SelectItem key={surface.value} value={surface.value}>
                                            {surface.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm font-medium mb-2">Hyra/Köp</Label>
                            <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Välj typ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {actionTypes.map((actionType) => (
                                        <SelectItem key={actionType.value} value={actionType.value}>
                                            {actionType.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex flex-col @lg:flex-row gap-4">
                    <Button size="lg">
                        <BriefcaseIcon />
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

export default SearchCommercial