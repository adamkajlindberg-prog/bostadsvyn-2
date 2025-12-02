"use client";

import { useQuery } from "@tanstack/react-query";
import type { Property } from "db";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import PropertyCard from "@/components/property-card";
import { useTRPC } from "@/trpc/client";

type SortOption =
  | "latest"
  | "price_asc"
  | "price_desc"
  | "area_asc"
  | "area_desc"
  | "rooms_asc"
  | "rooms_desc";

interface RentalFilters {
  search?: string;
  minRent?: number;
  maxRent?: number;
  type?: string; // e.g. 'APARTMENT' | 'HOUSE' | undefined
  sort?: SortOption;
  onCountChange?: (count: number) => void;
}

const RentalProperties = ({
  search,
  minRent,
  maxRent,
  type,
  sort = "latest",
  onCountChange,
}: RentalFilters) => {
  const trpc = useTRPC();

  // Build search filters
  const searchFilters = useMemo(() => {
    const filters: {
      listingType?: string;
      propertyType?: string;
      minRent?: number;
      maxRent?: number;
      query?: string;
      sortBy?: string;
    } = {
      listingType: "FOR_RENT",
    };

    if (type && type !== "ALL") {
      filters.propertyType = type;
    }

    if (typeof minRent === "number") {
      filters.minRent = minRent;
    }

    if (typeof maxRent === "number") {
      filters.maxRent = maxRent;
    }

    if (search && search.trim().length > 0) {
      filters.query = search.trim();
    }

    // Map sort options to sortBy
    switch (sort) {
      case "price_asc":
        filters.sortBy = "price_asc";
        break;
      case "price_desc":
        filters.sortBy = "price_desc";
        break;
      case "area_asc":
        filters.sortBy = "area_asc";
        break;
      case "area_desc":
        filters.sortBy = "area_desc";
        break;
      case "rooms_asc":
        filters.sortBy = "rooms_asc";
        break;
      case "rooms_desc":
        filters.sortBy = "rooms_desc";
        break;
      default:
        filters.sortBy = "latest";
    }

    return filters;
  }, [search, minRent, maxRent, type, sort]);

  const { data, isLoading } = useQuery(
    trpc.property.search.queryOptions(searchFilters),
  );

  const properties: Property[] = useMemo(() => {
    if (!data?.properties) return [];

    // Filter to only FOR_RENT properties
    const filtered = data.properties.filter(
      (p) => p.status === "FOR_RENT",
    ) as Property[];

    // Sort by ad_tier (premium > plus > free) first, then by the selected sort
    const tierPriority = {
      premium: 3,
      plus: 2,
      free: 1,
    } as const;

    filtered.sort((a, b) => {
      const aTier = (a.adTier || "free") as keyof typeof tierPriority;
      const bTier = (b.adTier || "free") as keyof typeof tierPriority;
      const aTierPriority = tierPriority[aTier];
      const bTierPriority = tierPriority[bTier];
      if (aTierPriority !== bTierPriority) {
        return bTierPriority - aTierPriority; // Higher priority first
      }
      // If same tier, maintain database sort order
      return 0;
    });

    return filtered;
  }, [data]);

  useEffect(() => {
    onCountChange?.(properties.length);
  }, [properties.length, onCountChange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Inga hyresobjekt tillgängliga just nu.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default RentalProperties;
