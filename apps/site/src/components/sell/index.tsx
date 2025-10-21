import ContainerWrapper from "@/components/common/container-wrapper"
import Hero from "./sections/hero"
import PricingPlans from "./sections/pricing-plans"
import UpgradeReasons from "./sections/upgrade-reasons"
import FAQ from "./sections/faq"
import Tools from "./sections/tools"
import AdvertisingPackages from "./sections/advertising-packages"
import StartSelling from "./sections/start-selling"

const Sell = () => {
    return (
        <div className="@container">
            <ContainerWrapper className="py-10">
                <Hero />
                <PricingPlans />
                <UpgradeReasons /> 
                <FAQ />
                <Tools />
                <AdvertisingPackages />
                <StartSelling />
            </ContainerWrapper>
        </div>
    )
}

export default Sell