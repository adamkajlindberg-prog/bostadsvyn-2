import ContainerWrapper from "@/components/common/container-wrapper";
import FounderStory from "./sections/founder-story";
import Hero from "./sections/hero";
import LegalDocuments from "./sections/legal-documents";
import PlatformOverview from "./sections/platform-overview";
import SecurityCompliance from "./sections/security-compliance";

const AboutUs = () => {
  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <Hero />
        <FounderStory />
        <PlatformOverview />
        <SecurityCompliance />
        <LegalDocuments />
      </ContainerWrapper>
    </div>
  );
};

export default AboutUs;
