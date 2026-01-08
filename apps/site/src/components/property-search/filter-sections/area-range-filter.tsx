import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface AreaRangeFilterProps {
  minArea: number;
  maxArea: number;
  onValueChange: (min: number, max: number) => void;
  onValueCommit: (min: number, max: number) => void;
}

export const AreaRangeFilter = ({
  minArea,
  maxArea,
  onValueChange,
  onValueCommit,
}: AreaRangeFilterProps) => {
  return (
    <div>
      <Label>Boarea (m²)</Label>
      <div className="mt-4 space-y-4">
        <Slider
          value={[minArea, maxArea]}
          onValueChange={([min, max]) => onValueChange(min, max)}
          onValueCommit={([min, max]) => onValueCommit(min, max)}
          max={1000}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{minArea} m²</span>
          <span>{maxArea} m²</span>
        </div>
      </div>
    </div>
  );
};

