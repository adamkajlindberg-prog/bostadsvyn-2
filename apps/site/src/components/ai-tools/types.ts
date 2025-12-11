import type { LucideIcon } from "lucide-react";

export type ToolTheme =
  | "accent"
  | "primary"
  | "premium"
  | "success"
  | "nordic-aurora"
  | "nordic-fjord";

export interface ToolFeature {
  text: string;
}

export interface AITool {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  theme: ToolTheme;
  features: ToolFeature[];
  hasGradient?: boolean;
}
