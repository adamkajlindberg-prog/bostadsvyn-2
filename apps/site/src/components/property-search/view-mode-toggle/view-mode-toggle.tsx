import { Grid, MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewMode = "grid" | "map";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewModeToggle = ({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewModeChange("grid")}
      >
        <Grid className="h-4 w-4" />
      </Button>

      <Button
        variant={viewMode === "map" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewModeChange("map")}
      >
        <MapIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

