import { Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AISearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
}

export const AISearchInput = ({
  value,
  onChange,
  onSearch,
}: AISearchInputProps) => {
  return (
    <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="h-5 w-5 text-primary" />
        <Label className="text-sm font-medium">Smart AI-sökning</Label>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Beskriv din drömbostad i naturligt språk. Vår AI tolkar automatiskt dina
        önskemål.
      </p>
      <div className="flex gap-2">
        <Input
          placeholder="T.ex. '3 rum lägenhet i Stockholm'"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-sm py-[19px] bg-background shadow-none"
        />
        <Button onClick={() => onSearch(value)}>
          <Sparkles className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

