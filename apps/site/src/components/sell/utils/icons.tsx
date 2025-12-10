import {
  ArrowRight,
  Award,
  BarChart3,
  Camera,
  CheckCircle,
  CircleCheck,
  CircleCheckBig,
  Coins,
  Crown,
  Eye,
  FileCheck,
  Gauge,
  HeartHandshake,
  Landmark,
  MapPin,
  Network,
  Plus,
  Search,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

/**
 * Icon name to component mapping.
 * This centralizes icon references to prevent JSX in data arrays,
 * which can cause hydration mismatches and unnecessary re-renders.
 */
const iconMap = {
  arrowRight: ArrowRight,
  award: Award,
  barChart3: BarChart3,
  camera: Camera,
  checkCircle: CheckCircle,
  circleCheck: CircleCheck,
  circleCheckBig: CircleCheckBig,
  coins: Coins,
  crown: Crown,
  eye: Eye,
  fileCheck: FileCheck,
  gauge: Gauge,
  heartHandshake: HeartHandshake,
  landmark: Landmark,
  mapPin: MapPin,
  network: Network,
  plus: Plus,
  search: Search,
  shield: Shield,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  trendingUp: TrendingUp,
  userCheck: UserCheck,
  users: Users,
  zap: Zap,
} as const;

export type IconName = keyof typeof iconMap;

/**
 * Get an icon component by name.
 * Returns the icon component for rendering.
 */
export function getIconComponent(name: IconName): ComponentType<LucideProps> {
  return iconMap[name];
}

/**
 * Render an icon by name with optional props.
 * Use this when you need to render an icon from data.
 */
export function renderIcon(name: IconName, props?: LucideProps) {
  const Icon = iconMap[name];
  return <Icon {...props} />;
}
