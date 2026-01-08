import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { energyClasses } from "@/utils/constants";

interface EnergyClassFilterProps {
  selectedClasses: string[];
  onClassToggle: (energyClass: string) => void;
}

export const EnergyClassFilter = ({
  selectedClasses,
  onClassToggle,
}: EnergyClassFilterProps) => {
  return (
    <div>
      <Label>Energiklass</Label>
      <div className="mt-2 flex flex-wrap gap-2">
        {energyClasses.map((energyClass) => (
          <Button
            key={energyClass}
            variant={
              selectedClasses?.includes(energyClass) ? "default" : "outline"
            }
            size="sm"
            onClick={() => onClassToggle(energyClass)}
          >
            {energyClass}
          </Button>
        ))}
      </div>
    </div>
  );
};

