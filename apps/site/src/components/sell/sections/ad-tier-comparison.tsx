import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SectionHeader } from "../components/section-header";
import { PropertyPreview } from "../components/property-preview";
import {
  AD_TIERS,
  SECTION_HEADERS,
  type AdTierData,
  type TierFeature,
} from "@/utils/constants";
import { renderIcon } from "../utils/icons";
import {
  premiumExample,
  plusExample,
  freeExample,
} from "../data/mock-properties";

const propertyByTier = {
  premium: premiumExample,
  plus: plusExample,
  free: freeExample,
} as const;

const sizeByTier = {
  premium: "large",
  plus: "medium",
  free: "small",
} as const;

interface TierFeatureListProps {
  features: readonly TierFeature[];
}

function TierFeatureList({ features }: TierFeatureListProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      {features.map((feature) => (
        <div key={feature.title}>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            {feature.title}
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1 ml-6">
            {feature.items.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

interface TierCardProps {
  tier: AdTierData;
}

function TierCard({ tier }: TierCardProps) {
  const property = propertyByTier[tier.tier];
  const size = sizeByTier[tier.tier];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className={cn(tier.iconBgClass, "rounded-xl p-3 shadow-md")}>
          {renderIcon(tier.iconName, {
            className: cn("h-6 w-6", tier.iconColorClass),
          })}
        </div>
        <div>
          <h3 className="text-2xl font-bold">
            {tier.title} - {tier.price}
          </h3>
          <p className="text-muted-foreground">{tier.description}</p>
        </div>
      </div>
      <Card className={cn("shadow-xl", tier.cardBgClass, tier.cardBorderClass)}>
        <CardContent className="p-6">
          <TierFeatureList features={tier.features} />
          <div className="border-t pt-6">
            <PropertyPreview property={property} size={size} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdTierComparison() {
  const headerData = SECTION_HEADERS.adTierComparison;

  return (
    <section className="mb-20">
      <SectionHeader
        badgeIconName={headerData.badgeIconName}
        badgeText={headerData.badgeText}
        badgeColorClass={headerData.badgeColorClass}
        title={headerData.title}
        description={headerData.description}
      />

      <div className="space-y-16">
        {AD_TIERS.map((tier) => (
          <TierCard key={tier.tier} tier={tier} />
        ))}
      </div>
    </section>
  );
}
