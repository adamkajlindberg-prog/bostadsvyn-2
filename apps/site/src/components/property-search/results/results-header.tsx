import { ViewModeToggle } from "../view-mode-toggle/view-mode-toggle";

type ViewMode = "grid" | "map";

interface ResultsHeaderProps {
  totalResults: number;
  isLoading: boolean;
  isFetching: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ResultsHeader = ({
  totalResults,
  isLoading,
  isFetching,
  viewMode,
  onViewModeChange,
}: ResultsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-semibold">Sök alla fastigheter</h1>
        <p className="text-muted-foreground">
          {isLoading || isFetching
            ? "Söker fastigheter..."
            : `${totalResults} fastigheter hittades`}
        </p>
      </div>

      <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
    </div>
  );
};

