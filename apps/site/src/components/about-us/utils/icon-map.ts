import type { IconName } from "../types";
import {
  Target,
  Rocket,
  Home,
  Brain,
  Shield,
  Lock,
  CheckCircle2,
  Eye,
  AlertTriangle,
  FileText,
  Users,
  ExternalLink,
  Heart,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps icon name strings to Lucide icon components
 * This prevents hydration issues by ensuring server and client render the same components
 */
const iconMap: Record<IconName, LucideIcon> = {
  target: Target,
  rocket: Rocket,
  home: Home,
  brain: Brain,
  shield: Shield,
  lock: Lock,
  "check-circle-2": CheckCircle2,
  eye: Eye,
  "alert-triangle": AlertTriangle,
  "file-text": FileText,
  users: Users,
  "external-link": ExternalLink,
  heart: Heart,
  zap: Zap,
};

/**
 * Get icon component by name
 * @param iconName - The name of the icon
 * @returns The Lucide icon component
 */
export function getIcon(iconName: IconName): LucideIcon {
  return iconMap[iconName];
}
