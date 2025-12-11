import type { LucideIcon } from "lucide-react";

/**
 * Icon identifier type - uses string names instead of JSX to prevent hydration issues
 */
export type IconName =
  | "target"
  | "rocket"
  | "home"
  | "brain"
  | "shield"
  | "lock"
  | "check-circle-2"
  | "eye"
  | "alert-triangle"
  | "file-text"
  | "users"
  | "external-link"
  | "heart"
  | "zap";

/**
 * Security and compliance item
 */
export interface SecurityItem {
  id: string;
  iconName: IconName;
  title: string;
  description: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
}

/**
 * Legal document link item
 */
export interface DocumentItem {
  id: string;
  iconName: IconName;
  title: string;
  description: string;
  link: string;
  iconColor: string;
}

/**
 * Compliance regulation item
 */
export interface ComplianceItem {
  id: string;
  name: string;
}

/**
 * Value category card
 */
export interface ValueCategory {
  id: string;
  iconName: IconName;
  name: string;
  description: string;
}

/**
 * Advantage/unique feature
 */
export interface Advantage {
  id: string;
  iconName: IconName;
  title: string;
  description: string;
}

/**
 * Platform feature card
 */
export interface PlatformFeature {
  id: string;
  iconName: IconName;
  title: string;
  description: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
}

/**
 * Mission or Vision card
 */
export interface MissionVisionCard {
  id: "mission" | "vision";
  iconName: IconName;
  title: string;
  paragraphs: string[];
  borderColor: string;
}

/**
 * Hero section content
 */
export interface HeroContent {
  badge: string;
  title: string;
  description: string;
}

/**
 * Founder story content
 */
export interface FounderStoryContent {
  title: string;
  subtitle: string;
  description: string;
  quote: string;
  author: string;
}

/**
 * Section header
 */
export interface SectionHeader {
  title: string;
  description?: string;
}
