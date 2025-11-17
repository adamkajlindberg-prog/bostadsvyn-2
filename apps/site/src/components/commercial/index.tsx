import ContainerWrapper from "@/components/common/container-wrapper"
import Hero from "./sections/hero"
import SearchCommercial from "./sections/search-commercial"
import Highlights from "./sections/highlights"
import CommercialProperties from "./sections/commercial-properties"
import Services from "./sections/services"
import BrowseCommercials from "./sections/browse-commercials"

const Commercial = () => {
    return (
        <div className="@container">
            <ContainerWrapper className="py-10">
                <Hero />
                <SearchCommercial />
                <Highlights />
                <CommercialProperties />
                <Services />
                <BrowseCommercials />
            </ContainerWrapper>
        </div>
    )
}

export default Commercial