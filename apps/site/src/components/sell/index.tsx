import ContainerWrapper from "@/components/common/container-wrapper";
import AdvertisingPackages from "./sections/advertising-packages";
import FAQ from "./sections/faq";
import Hero from "./sections/hero";
import PricingPlans from "./sections/pricing-plans";
import StartSelling from "./sections/start-selling";
import Tools from "./sections/tools";
import UpgradeReasons from "./sections/upgrade-reasons";

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
  );
};

export default Sell;
