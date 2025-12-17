import ContainerWrapper from "@/components/common/container-wrapper";
import FounderStory from "./sections/founder-story";
import Hero from "./sections/hero";
import LegalDocuments from "./sections/legal-documents";
import OurValues from "./sections/our-values";
import PlatformOverview from "./sections/platform-overview";
import SecurityCompliance from "./sections/security-compliance";

/**
 * About Us page component
 * Server Component - no client-side JavaScript needed
 */
const AboutUs = () => {
  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <Hero />
        <FounderStory />
        <OurValues />
        <PlatformOverview />
        <SecurityCompliance />
        <LegalDocuments />
      </ContainerWrapper>
    </div>
  );
};

export default AboutUs;
