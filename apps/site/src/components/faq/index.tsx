import ContainerWrapper from "@/components/common/container-wrapper";
import { FaqHero } from "./faq-hero";
import { FaqContent } from "./faq-content";
import { FaqSupportSection } from "./faq-support-section";

const Faq = () => {
  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <FaqHero />

        <FaqContent />

        <FaqSupportSection />
      </ContainerWrapper>
    </div>
  );
};

export default Faq;
