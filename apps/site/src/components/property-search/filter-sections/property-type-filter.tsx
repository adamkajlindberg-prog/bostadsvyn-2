import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { propertyTypeLabels } from "@/utils/constants";

interface PropertyTypeFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const PROPERTY_TYPES = [
  "APARTMENT",
  "HOUSE",
  "TOWNHOUSE",
  "COTTAGE",
  "PLOT",
  "COMMERCIAL",
] as const;

export const PropertyTypeFilter = ({
  selectedType,
  onTypeChange,
}: PropertyTypeFilterProps) => {
  return (
    <div>
      <Label>Fastighetstyp</Label>
      <div className="mt-2 space-y-2">
        {PROPERTY_TYPES.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox
              id={type}
              checked={selectedType === type.toLowerCase()}
              onCheckedChange={() => onTypeChange(type.toLowerCase())}
            />
            <Label htmlFor={type} className="text-sm cursor-pointer">
              {propertyTypeLabels[type]}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

