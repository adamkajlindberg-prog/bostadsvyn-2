import { Card, CardContent } from "@/components/ui/card";
import { securityItems, securityComplianceHeader } from "@/utils/constants";
import { getIcon } from "../utils/icon-map";

const SecurityCompliance = () => {
  return (
    <section className="mb-16" aria-labelledby="security-compliance-title">
      <div className="text-center mb-12">
        <h2 id="security-compliance-title" className="text-3xl font-bold mb-4">
          {securityComplianceHeader.title}
        </h2>
        {securityComplianceHeader.description && (
          <p className="text-foreground max-w-2xl mx-auto">
            {securityComplianceHeader.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {securityItems.map((item) => {
          const IconComponent = getIcon(item.iconName);
          return (
            <Card key={item.id} className={item.borderColor}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${item.iconBg} rounded-full p-3`}>
                    <IconComponent className={`h-6 w-6 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default SecurityCompliance;
