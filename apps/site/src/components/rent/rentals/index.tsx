import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SelectValue } from "@radix-ui/react-select"
import { FunnelIcon, Grid3X3Icon, ListIcon, SlidersHorizontalIcon, TriangleAlertIcon } from "lucide-react"

const filterOptions = [
  { value: "all", label: "Alla typer" },
  { value: "apartment", label: "Lägenheter" },
  { value: "house", label: "Hus" },
  { value: "radhus", label: "Radhus" },
  { value: "cottage", label: "Stugor" },
]

const sortOptions = [
    {
        value: "recent",
        label: "Senast tillagda"
    },
    {
        value: "price-lowest",
        label: "Pris: Lägst först"
    },
    {
        value: "price-highest",
        label: "Pris: Högst först"
    },
    {
        value: "living-area",
        label: "Living area"
    },
]

const Rentals = () => {
    return (
        <div className="container mx-auto max-w-7xl">
            <Card className="border shadow-none bg-card py-7">
                <CardContent className="px-7">
                    <div className="flex flex-col @4xl:flex-row justify-between mb-6">
                        <div>
                            <h3 className="text-xl @lg:text-2xl font-semibold mb-1">Tillgängliga hyresbostäder</h3>
                            <p className="text-muted-foreground">0 hyresbostäder hittades</p>
                        </div>

                        <div className="flex flex-col @2xl:flex-row gap-3 @2xl:gap-4 mt-6 @4xl:mt-0">
                            <Tabs defaultValue="grid">
                                <TabsList className="bg-primary/20">
                                    <TabsTrigger value="grid">
                                        <Grid3X3Icon />
                                    </TabsTrigger>
                                    <TabsTrigger value="list">
                                        <ListIcon />
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <Select defaultValue="all">
                                <SelectTrigger>
                                    <FunnelIcon />
                                    <SelectValue placeholder="Filtrera" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {filterOptions.map((filter) => (
                                            <SelectItem key={filter.value} value={filter.value}>
                                                {filter.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Select defaultValue="recent">
                                <SelectTrigger>
                                    <SlidersHorizontalIcon />
                                    <SelectValue placeholder="Sortera" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {sortOptions.map((sort) => (
                                            <SelectItem key={sort.value} value={sort.value}>
                                                {sort.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 @lg:grid-cols-3 gap-3 @lg:gap-4 mb-4 @lg:mb-8">
                        <Input type="text" className="text-sm" placeholder="Sök stad, adress..." />
                        <Input type="text" className="text-sm" placeholder="Min hyra (kr/mån)" />
                        <Input type="text" className="text-sm" placeholder="Max hyra (kr/mån)" />
                    </div>

                    <div className="flex flex-col items-center pb-12 pt-10">
                        <TriangleAlertIcon size={40} className="text-muted-foreground mb-4" />
                        <div className="text-lg @lg:text-xl font-semibold mb-2 text-center">Inga hyresbostäder hittades</div>
                        <div className="text-sm @lg:text-base text-muted-foreground text-center">Prova att ändra dina sökfilter eller kolla tillbaka senare.</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Rentals