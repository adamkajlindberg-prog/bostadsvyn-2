import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "../components/section-header";
import { FeatureCard } from "../components/feature-card";
import {
  BROKER_FEATURES,
  BROKER_INTRO_TEXT,
  SECTION_HEADERS,
} from "@/utils/constants";

export default function BrokerSection() {
  const headerData = SECTION_HEADERS.brokerSection;

  return (
    <section className="mb-20">
      <SectionHeader
        badgeIconName={headerData.badgeIconName}
        badgeText={headerData.badgeText}
        badgeColorClass={headerData.badgeColorClass}
        title={headerData.title}
        description={headerData.description}
      />

      <Card className="shadow-2xl bg-gradient-to-br from-blue-500/10 via-green-500/5 to-card border-blue-500/30">
        <CardContent className="p-10">
          <p className="text-base text-muted-foreground mb-8 leading-relaxed">
            {BROKER_INTRO_TEXT}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BROKER_FEATURES.map((feature) => (
              <FeatureCard
                key={feature.title}
                iconName={feature.iconName}
                iconColorClass={feature.iconColorClass}
                iconBgClass={feature.iconBgClass}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
