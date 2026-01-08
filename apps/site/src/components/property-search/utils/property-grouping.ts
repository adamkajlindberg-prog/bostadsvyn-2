import type { Property } from "db";

export type PropertyGroup = {
  label: string;
  properties: Property[];
};

/**
 * Groups properties by days since creation and returns sorted groups
 */
export const groupPropertiesByDays = (
  propertiesToGroup: Property[],
): PropertyGroup[] => {
  const groups: Record<string, Property[]> = {};
  const now = new Date();

  propertiesToGroup.forEach((property) => {
    if (!property.createdAt) return;

    const createdDate = new Date(property.createdAt);
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let groupKey: string;
    if (diffDays === 0) {
      groupKey = "Idag";
    } else if (diffDays === 1) {
      groupKey = "Igår";
    } else if (diffDays >= 2 && diffDays <= 7) {
      groupKey = `${diffDays} dagar`;
    } else if (diffDays > 7 && diffDays <= 28) {
      const weeks = Math.floor(diffDays / 7);
      groupKey = `${weeks} ${weeks === 1 ? "vecka" : "veckor"}`;
    } else {
      const weeks = Math.floor(diffDays / 7);
      groupKey = `${weeks} veckor`;
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(property);
  });

  // Sort groups by time (newest first)
  const sortedGroups: PropertyGroup[] = [];

  // Add "Idag" first
  if (groups["Idag"]) {
    sortedGroups.push({
      label: "Idag",
      properties: groups["Idag"],
    });
  }

  // Add "Igår" second
  if (groups["Igår"]) {
    sortedGroups.push({
      label: "Igår",
      properties: groups["Igår"],
    });
  }

  // Add day groups (2-7 days)
  for (let i = 2; i <= 7; i++) {
    const key = `${i} dagar`;
    if (groups[key]) {
      sortedGroups.push({
        label: key,
        properties: groups[key],
      });
    }
  }

  // Add week groups
  const weekKeys = Object.keys(groups).filter(
    (k) => k.includes("vecka") || k.includes("veckor"),
  );
  weekKeys
    .sort((a, b) => {
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      return aNum - bNum;
    })
    .forEach((key) => {
      sortedGroups.push({
        label: key,
        properties: groups[key],
      });
    });

  return sortedGroups;
};

