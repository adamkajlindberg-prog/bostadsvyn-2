import ContainerWrapper from "@/components/common/container-wrapper";
import BrowseMore from "./sections/browse-more";
import Hero from "./sections/hero";
import LegalDocuments from "./sections/legal-documents";
import OurValues from "./sections/our-values";
import SecurityCompliance from "./sections/security-compliance";

const AboutUs = () => {
  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <Hero />
        <OurValues />
        <SecurityCompliance />
        <LegalDocuments />
        <BrowseMore />
      </ContainerWrapper>
    </div>
  );
};

export default AboutUs;
