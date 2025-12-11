import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AITool } from "./types";
import { FeatureList } from "./feature-list";

interface ToolCardProps {
  tool: AITool;
}

function getThemeClasses(theme: AITool["theme"], hasGradient: boolean) {
  const baseClasses = `border-2`;
  const gradientClass = hasGradient ? "bg-gradient-to-br" : "";

  switch (theme) {
    case "accent":
      return {
        border: cn(baseClasses, "border-accent/30"),
        background: hasGradient
          ? cn(gradientClass, "from-accent/5 to-transparent")
          : "",
        iconBg: "bg-accent/10",
        iconColor: "text-accent",
      };
    case "primary":
      return {
        border: cn(baseClasses, "border-primary/30"),
        background: hasGradient
          ? cn(gradientClass, "from-primary/5 to-transparent")
          : "",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
      };
    case "premium":
      return {
        border: cn(baseClasses, "border-premium/30"),
        background: "",
        iconBg: "bg-premium/10",
        iconColor: "text-premium",
      };
    case "success":
      return {
        border: cn(baseClasses, "border-success/30"),
        background: "",
        iconBg: "bg-success/10",
        iconColor: "text-success",
      };
    case "nordic-aurora":
      return {
        border: cn(baseClasses, "border-nordic-aurora/30"),
        background: "",
        iconBg: "bg-nordic-aurora/10",
        iconColor: "text-nordic-aurora",
      };
    case "nordic-fjord":
      return {
        border: cn(baseClasses, "border-nordic-fjord/30"),
        background: "",
        iconBg: "bg-nordic-fjord/10",
        iconColor: "text-nordic-fjord",
      };
    default:
      return {
        border: cn(baseClasses, "border-accent/30"),
        background: "",
        iconBg: "bg-accent/10",
        iconColor: "text-accent",
      };
  }
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;
  const themeClasses = getThemeClasses(tool.theme, tool.hasGradient ?? false);

  return (
    <Card className={cn(themeClasses.border, themeClasses.background)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={cn(themeClasses.iconBg, "rounded-lg p-3")}>
            <Icon className={cn("h-6 w-6", themeClasses.iconColor)} />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{tool.title}</h3>
          </div>
        </div>
        <p className="text-foreground font-medium mb-4 leading-relaxed">
          {tool.description}
        </p>
        <FeatureList features={tool.features} iconColor={themeClasses.iconColor} />
      </CardContent>
    </Card>
  );
}
