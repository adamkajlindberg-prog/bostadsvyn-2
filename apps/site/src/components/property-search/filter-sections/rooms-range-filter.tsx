import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface RoomsRangeFilterProps {
  minRooms: number;
  maxRooms: number;
  onValueChange: (min: number, max: number) => void;
  onValueCommit: (min: number, max: number) => void;
}

export const RoomsRangeFilter = ({
  minRooms,
  maxRooms,
  onValueChange,
  onValueCommit,
}: RoomsRangeFilterProps) => {
  return (
    <div>
      <Label>Antal rum</Label>
      <div className="mt-4 space-y-4">
        <Slider
          value={[minRooms, maxRooms]}
          onValueChange={([min, max]) => onValueChange(min, max)}
          onValueCommit={([min, max]) => onValueCommit(min, max)}
          max={10}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{minRooms} rum</span>
          <span>{maxRooms}+ rum</span>
        </div>
      </div>
    </div>
  );
};

