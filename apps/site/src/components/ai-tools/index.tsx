import ContainerWrapper from "@/components/common/container-wrapper";
import { SectionHeader } from "./section-header";
import { ToolCard } from "./tool-card";
import { aiTools } from "@/utils/constants";

const Tools = () => {
  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <div className="mb-12">
          <SectionHeader />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {aiTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </ContainerWrapper>
    </div>
  );
};

export default Tools;
