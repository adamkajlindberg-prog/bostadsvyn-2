import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const BasicSearchInput = ({
  value,
  onChange,
  placeholder = "T.ex. Villa i Stockholm",
}: BasicSearchInputProps) => {
  return (
    <div>
      <Label>Söka</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-3 py-[19px]"
      />
    </div>
  );
};

