"use client";

import { useQuery } from "@tanstack/react-query";
import type { Property } from "db";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import PropertyCard from "@/components/property-card";
import { useTRPC } from "@/trpc/client";

type SortOption = "latest" | "price_asc" | "price_desc";

interface NyproduktionPropertiesProps {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  sort?: SortOption;
  onCountChange?: (count: number) => void;
}

const NyproduktionProperties: React.FC<NyproduktionPropertiesProps> = ({
  search,
  minPrice,
  maxPrice,
  type,
  sort = "latest",
  onCountChange,
}) => {
  const trpc = useTRPC();

  // Build search filters
  const searchFilters = useMemo(() => {
    const filters: {
      listingType?: string;
      propertyType?: string;
      minPrice?: number;
      maxPrice?: number;
      query?: string;
      sortBy?: string;
    } = {
      listingType: "COMING_SOON",
    };

    if (type && type !== "ALL") {
      filters.propertyType = type;
    }

    if (typeof minPrice === "number") {
      filters.minPrice = minPrice;
    }

    if (typeof maxPrice === "number") {
      filters.maxPrice = maxPrice;
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
      default:
        filters.sortBy = "latest";
    }

    return filters;
  }, [search, minPrice, maxPrice, type, sort]);

  const { data, isLoading } = useQuery(
    trpc.property.search.queryOptions(searchFilters),
  );

  const properties: Property[] = useMemo(() => {
    if (!data?.properties) return [];

    // Filter to only COMING_SOON properties
    const filtered = data.properties.filter(
      (p) => p.status === "COMING_SOON",
    ) as Property[];

    // Sort by ad_tier (premium > plus > free) first, then by the selected sort
    const tierPriority: Record<"premium" | "plus" | "free", number> = {
      premium: 3,
      plus: 2,
      free: 1,
    };

    filtered.sort((a, b) => {
      const aTierPriority =
        tierPriority[(a.adTier ?? "free") as keyof typeof tierPriority];
      const bTierPriority =
        tierPriority[(b.adTier ?? "free") as keyof typeof tierPriority];
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
          Inga nyproduktionsobjekt hittades med dina filter.
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

export default NyproduktionProperties;
