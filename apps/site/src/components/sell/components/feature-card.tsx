import { cn } from "@/lib/utils";
import type { IconName } from "../utils/icons";
import { renderIcon } from "../utils/icons";

interface FeatureCardProps {
  iconName: IconName;
  iconColorClass: string;
  iconBgClass: string;
  title: string;
  description: string;
  className?: string;
  layout?: "horizontal" | "vertical";
  iconSize?: "sm" | "md" | "lg";
}

const iconSizeMap = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-8 w-8",
} as const;

const containerSizeMap = {
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
} as const;

/**
 * Reusable feature card component with icon, title, and description.
 * Supports horizontal (icon left) and vertical (icon top) layouts.
 */
export function FeatureCard({
  iconName,
  iconColorClass,
  iconBgClass,
  title,
  description,
  className,
  layout = "horizontal",
  iconSize = "md",
}: FeatureCardProps) {
  if (layout === "vertical") {
    return (
      <div className={cn("text-center", className)}>
        <div
          className={cn(
            iconBgClass,
            "rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-5 shadow-lg"
          )}
        >
          {renderIcon(iconName, {
            className: cn(iconSizeMap[iconSize], iconColorClass),
          })}
        </div>
        <h4 className="font-bold text-lg mb-3">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex items-start gap-4", className)}>
      <div className={cn(iconBgClass, "rounded-xl shadow-md", containerSizeMap[iconSize])}>
        {renderIcon(iconName, {
          className: cn(iconSizeMap[iconSize], iconColorClass, "flex-shrink-0"),
        })}
      </div>
      <div>
        <h4 className="font-semibold text-base mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
