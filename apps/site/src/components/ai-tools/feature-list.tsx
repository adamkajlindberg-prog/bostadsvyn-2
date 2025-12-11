import { CheckCircle2 } from "lucide-react";
import type { ToolFeature } from "./types";
import { cn } from "@/lib/utils";

interface FeatureListProps {
  features: ToolFeature[];
  iconColor: string;
}

export function FeatureList({ features, iconColor }: FeatureListProps) {
  return (
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2 text-sm">
          <CheckCircle2 className={cn("h-4 w-4", iconColor)} />
          <span>{feature.text}</span>
        </li>
      ))}
    </ul>
  );
}
