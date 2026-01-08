import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export const EmptyState = ({ onClearFilters }: EmptyStateProps) => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Inga fastigheter hittades
        </h3>
        <p className="text-muted-foreground mb-4">
          Prova att justera dina sökkriterier för att hitta fler fastigheter.
        </p>
        <Button onClick={onClearFilters}>Rensa filter</Button>
      </CardContent>
    </Card>
  );
};

