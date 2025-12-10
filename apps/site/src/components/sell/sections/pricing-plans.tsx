import { CircleCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PRICING_PLANS, type PricingPlan } from "../data";
import { renderIcon } from "../utils/icons";

interface PlanCardProps {
  plan: PricingPlan;
}

function PlanCard({ plan }: PlanCardProps) {
  const isBasePlan = plan.name === "Grundpaket";

  return (
    <div
      className={cn("relative border rounded-lg p-6 shadow-xs", {
        "border-2 border-primary py-6 mt-1 @4xl:mt-0 @5xl:-mt-3 @5xl:-mb-3":
          plan.isPopular,
      })}
    >
      {plan.isPopular && (
        <Badge className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
          Mest populär
        </Badge>
      )}
      <h3 className="text-lg font-semibold flex justify-between items-center">
        {plan.name}
        {renderIcon(plan.iconName, { size: 18 })}
      </h3>
      <p className="mt-2 text-4xl font-semibold">
        {plan.price}{" "}
        <span className="text-lg text-muted-foreground font-normal">SEK</span>
      </p>
      <p className="mt-4 text-sm text-muted-foreground">{plan.description}</p>
      <Separator className="my-4" />
      <ul className="space-y-2">
        {plan.features.map((feature) => (
          <li key={feature.name} className="flex items-start gap-2">
            <CircleCheck className="h-4 w-4 mt-0.5 text-green-600" />
            <div>
              <div className="text-sm font-medium mb-1">{feature.name}</div>
              <div className="text-xs text-muted-foreground">
                {feature.description}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Button
        variant={isBasePlan ? "outline" : "default"}
        size="lg"
        className="w-full mt-6 mb-4"
        disabled={plan.buttonIsDisabled}
      >
        {plan.buttonText}
      </Button>
      {plan.footerText && (
        <div className="text-xs text-center text-muted-foreground">
          {plan.footerText}
        </div>
      )}
    </div>
  );
}

export default function PricingPlans() {
  return (
    <section className="mb-20">
      <h2 className="text-2xl @lg:text-3xl text-center font-semibold mb-4">
        Välj ditt annonspaket
      </h2>
      <p className="text-base @lg:text-lg text-center text-muted-foreground max-w-2xl mx-auto mb-8 @4xl:mb-10 @5xl:mb-12">
        Öka din fastighets synlighet och nå fler potentiella köpare med våra
        premium annonsnivåer.
      </p>

      <div className="mx-auto grid grid-cols-1 @4xl:grid-cols-2 @5xl:grid-cols-3 auto-rows-min items-stretch gap-4">
        {PRICING_PLANS.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>
    </section>
  );
}
