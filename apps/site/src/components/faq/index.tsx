import { MessageCircleIcon, SparklesIcon } from "lucide-react";
import ContainerWrapper from "@/components/common/container-wrapper";
import { Button } from "@/components/ui/button";
import { FAQ_PAGE_CONFIG } from "@/utils/constants";
import { FaqHero } from "./faq-hero";
import { FaqContent } from "./faq-content";
import { FaqSupportSection } from "./faq-support-section";

const Faq = () => {
  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <FaqHero />

        <FaqContent />

        <div className="flex justify-center mb-14">
          <Button size="lg" className="rounded-full py-6 w-full max-w-72">
            <MessageCircleIcon />
            {FAQ_PAGE_CONFIG.buttons.chatWithAI}
            <SparklesIcon />
          </Button>
        </div>

        <FaqSupportSection />
      </ContainerWrapper>
    </div>
  );
};

export default Faq;
