import { Grid3X3Icon, MapIcon } from "lucide-react"
import ContainerWrapper from "@/components/common/container-wrapper"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SearchFilter from "./search-filter"
import Properties from "./properties"

const SearchProperty = () => {
    return (
        <div className="@container">
            <ContainerWrapper className="py-10">
                <div className="flex flex-col @4xl:flex-row @4xl:justify-between items-start gap-8 mb-8">
                    <div>
                        <h2 className="text-2xl @lg:text-3xl tracking-tight font-semibold mb-1">
                            Sök alla fastigheter
                        </h2>
                        <p className="text-sm @lg:text-base text-muted-foreground">50 fastigheter hittades &bull; Både köp och hyra</p>
                    </div>

                    <Tabs defaultValue="grid">
                        <TabsList className="bg-primary/20">
                            <TabsTrigger value="grid">
                                <Grid3X3Icon />
                            </TabsTrigger>
                            <TabsTrigger value="map">
                                <MapIcon />
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="grid @4xl:grid-cols-12 gap-8 items-start">
                    <SearchFilter />
                    <Properties />
                </div>
            </ContainerWrapper>
        </div>
    )
}

export default SearchProperty