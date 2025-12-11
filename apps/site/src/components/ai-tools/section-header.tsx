import { Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SectionHeaderProps {
  badgeLabel?: string;
  title?: string;
  description?: string;
}

export function SectionHeader({
  badgeLabel = "Artificiell Intelligens",
  title = "Våra AI-verktyg",
  description = "Vi har utvecklat en omfattande svit av AI-verktyg som revolutionerar hur du köper, säljer och hyr fastigheter. Alla verktyg är integrerade för en sömlös upplevelse.",
}: SectionHeaderProps) {
  return (
    <div className="text-center mb-12">
      <Badge className="bg-accent text-accent-foreground mb-4">
        <Brain className="h-4 w-4 mr-2" />
        {badgeLabel}
      </Badge>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
      <p className="text-foreground font-medium max-w-3xl mx-auto text-lg">
        {description}
      </p>
    </div>
  );
}
