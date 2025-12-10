import ContainerWrapper from "@/components/common/container-wrapper";
import AdTierComparison from "./sections/ad-tier-comparison";
import SellingProcess from "./sections/selling-process";
import BrokerSection from "./sections/broker-section";
import PricingPlans from "./sections/pricing-plans";

/**
 * Sell page main component.
 *
 * Structure:
 * - AdTierComparison: Shows the visual difference between ad packages
 * - SellingProcess: 5-step guide to selling with AI tools
 * - BrokerSection: Information about certified broker network
 * - PricingPlans: Pricing cards for the three ad tiers
 *
 * Architecture notes:
 * - Static data is centralized in ./data/index.ts
 * - Icons are referenced by name via ./utils/icons.tsx to prevent hydration issues
 * - PropertyCard previews use dynamic imports with SSR disabled
 * - Reusable UI patterns are in ./components/
 */
export default function Sell() {
  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <AdTierComparison />
        <SellingProcess />
        <BrokerSection />
        <PricingPlans />
      </ContainerWrapper>
    </div>
  );
}
