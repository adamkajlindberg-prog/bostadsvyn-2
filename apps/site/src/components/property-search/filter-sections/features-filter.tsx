import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { commonFeatures } from "@/utils/constants";

interface FeaturesFilterProps {
  selectedFeatures: string[];
  onFeatureToggle: (feature: string) => void;
}

export const FeaturesFilter = ({
  selectedFeatures,
  onFeatureToggle,
}: FeaturesFilterProps) => {
  return (
    <div>
      <Label>Egenskaper</Label>
      <div className="mt-2 space-y-2">
        {commonFeatures.map((feature) => (
          <div key={feature} className="flex items-center space-x-2">
            <Checkbox
              id={feature}
              checked={selectedFeatures?.includes(feature)}
              onCheckedChange={() => onFeatureToggle(feature)}
            />
            <Label htmlFor={feature} className="text-sm">
              {feature}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

