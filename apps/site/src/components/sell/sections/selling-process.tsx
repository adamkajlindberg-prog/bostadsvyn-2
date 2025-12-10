import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SectionHeader } from "../components/section-header";
import { SELLING_STEPS, SECTION_HEADERS, type SellingStep } from "../data";
import { renderIcon } from "../utils/icons";

interface StepCardProps {
  step: SellingStep;
  isLast: boolean;
}

function StepCard({ step, isLast }: StepCardProps) {
  return (
    <div className="text-center relative">
      <div
        className={cn(
          step.iconBgClass,
          "rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-5 shadow-lg"
        )}
      >
        {renderIcon(step.iconName, {
          className: cn("h-8 w-8", step.iconColorClass),
        })}
      </div>
      <h4 className="font-bold text-lg mb-3">{step.title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {step.description}
      </p>
      {step.showArrow && !isLast && (
        <div className="absolute -right-4 top-8 hidden lg:block">
          <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
        </div>
      )}
    </div>
  );
}

export default function SellingProcess() {
  const headerData = SECTION_HEADERS.sellingProcess;

  return (
    <section className="mb-20">
      <SectionHeader
        badgeIconName={headerData.badgeIconName}
        badgeText={headerData.badgeText}
        badgeColorClass={headerData.badgeColorClass}
        title={headerData.title}
        description={headerData.description}
        maxDescriptionWidth="max-w-3xl"
      />

      <Card className="shadow-2xl border-primary/30 bg-gradient-to-br from-card to-card/50">
        <CardContent className="py-10 px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {SELLING_STEPS.map((step, index) => (
              <StepCard
                key={step.title}
                step={step}
                isLast={index === SELLING_STEPS.length - 1}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
