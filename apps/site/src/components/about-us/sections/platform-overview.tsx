import { Card, CardContent } from "@/components/ui/card";
import { platformFeatures, platformOverviewHeader } from "@/utils/constants";
import { getIcon } from "../utils/icon-map";

const PlatformOverview = () => {
  return (
    <section className="mb-16" aria-labelledby="platform-overview-title">
      <div className="text-center mb-12">
        <h2
          id="platform-overview-title"
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          {platformOverviewHeader.title}
        </h2>
        {platformOverviewHeader.description && (
          <p className="text-foreground max-w-3xl mx-auto text-lg">
            {platformOverviewHeader.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {platformFeatures.map((feature) => {
          const IconComponent = getIcon(feature.iconName);
          return (
            <Card
              key={feature.id}
              className={`border-2 ${feature.borderColor} transition-all`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${feature.iconBg} rounded-lg p-3`}>
                    <IconComponent className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-3">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default PlatformOverview;
