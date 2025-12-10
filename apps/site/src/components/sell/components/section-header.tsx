import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { IconName } from "../utils/icons";
import { renderIcon } from "../utils/icons";

interface SectionHeaderProps {
  badgeIconName: IconName;
  badgeText: string;
  badgeColorClass?: string;
  title: string;
  description: string;
  className?: string;
  maxDescriptionWidth?: string;
}

/**
 * Reusable section header component with badge, title, and description.
 * Used consistently across all sell page sections.
 */
export function SectionHeader({
  badgeIconName,
  badgeText,
  badgeColorClass,
  title,
  description,
  className,
  maxDescriptionWidth = "max-w-4xl",
}: SectionHeaderProps) {
  return (
    <div className={cn("text-center mb-12", className)}>
      <Badge
        variant="outline"
        className={cn("mb-5 px-5 py-2 text-base", badgeColorClass)}
      >
        {renderIcon(badgeIconName, { className: "h-5 w-5 mr-2" })}
        {badgeText}
      </Badge>
      <h2 className="text-3xl md:text-4xl font-bold mb-5">{title}</h2>
      <p
        className={cn(
          "text-base text-muted-foreground mx-auto leading-relaxed",
          maxDescriptionWidth
        )}
      >
        {description}
      </p>
    </div>
  );
}
