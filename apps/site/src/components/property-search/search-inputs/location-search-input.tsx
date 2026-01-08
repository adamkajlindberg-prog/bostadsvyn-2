import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const LocationSearchInput = ({
  value,
  onChange,
  placeholder = "T.ex. Stockholm",
}: LocationSearchInputProps) => {
  return (
    <div>
      <Label>Sök plats</Label>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 py-[19px]"
      />
    </div>
  );
};

