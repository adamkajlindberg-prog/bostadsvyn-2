import ContainerWrapper from "@/components/common/container-wrapper"
import Hero from "./sections/hero"
import SearchPlots from "./sections/search-plots"
import LeisureCategories from "./sections/leisure-categories"
import HolidayHomes from "./sections/holiday-homes"
import TipsForBuyer from "./sections/tips-for-buyer"
import BrowseHomes from "./sections/browse-homes"

const LeisurePlots = () => {
    return (
        <div className="@container">
            <ContainerWrapper className="py-10">
                <Hero />
                <SearchPlots />
                <LeisureCategories />
                <HolidayHomes />
                <TipsForBuyer />
                <BrowseHomes />
            </ContainerWrapper>
        </div>
    )
}

export default LeisurePlots