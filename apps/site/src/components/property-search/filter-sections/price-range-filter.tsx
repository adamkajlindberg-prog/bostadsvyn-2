import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceRangeFilterProps {
  minPrice: string;
  maxPrice: string;
  onPriceChange: (value: string, type: "min" | "max") => void;
  show?: boolean;
}

export const PriceRangeFilter = ({
  minPrice,
  maxPrice,
  onPriceChange,
  show = true,
}: PriceRangeFilterProps) => {
  if (!show) return null;

  return (
    <div>
      <Label>Köpesumma (SEK)</Label>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Input
          type="number"
          placeholder="Från"
          value={minPrice}
          onChange={(e) => onPriceChange(e.target.value, "min")}
        />
        <Input
          type="number"
          placeholder="Till"
          value={maxPrice}
          onChange={(e) => onPriceChange(e.target.value, "max")}
        />
      </div>
    </div>
  );
};

