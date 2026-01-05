"use client";

import { useQuery } from "@tanstack/react-query";
import type { Property } from "db";
import { AlertCircleIcon, Loader2 } from "lucide-react";
import { useMemo } from "react";
import PropertyMap from "@/components/property-map";
import { useTRPC } from "@/trpc/client";

type SortOption = "latest" | "price_asc" | "price_desc";

interface FritidsMapProps {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  sort?: SortOption;
}

// Query configuration constants
const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const GC_TIME = 10 * 60 * 1000; // 10 minutes

// Property types for fritids
const FRITIDS_PROPERTY_TYPES = ["COTTAGE", "PLOT"] as const;
const VALID_STATUSES = ["FOR_SALE", "COMING_SOON"] as const;

const FritidsMap = ({
  search,
  minPrice,
  maxPrice,
  type,
  sort = "latest",
}: FritidsMapProps) => {
  const trpc = useTRPC();

  // Build search filters for fritids properties (COTTAGE, PLOT)
  const searchFilters = useMemo(() => {
    const filters: {
      listingType?: string;
      propertyType?: string;
      minPrice?: number;
      maxPrice?: number;
      query?: string;
      sortBy?: string;
    } = {
      listingType: "FOR_SALE",
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

    const trimmedSearch = search?.trim();
    if (trimmedSearch && trimmedSearch.length > 0) {
      filters.query = trimmedSearch;
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

  const { data, isLoading, error } = useQuery({
    ...trpc.property.search.queryOptions(searchFilters),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });

  // Filter to COTTAGE and PLOT properties with valid coordinates
  const properties = useMemo<Property[]>(() => {
    if (!data?.properties) return [];

    return data.properties.filter(
      (p): p is Property =>
        FRITIDS_PROPERTY_TYPES.includes(
          p.propertyType as (typeof FRITIDS_PROPERTY_TYPES)[number],
        ) &&
        VALID_STATUSES.includes(p.status as (typeof VALID_STATUSES)[number]) &&
        p.latitude !== null &&
        p.latitude !== undefined &&
        p.longitude !== null &&
        p.longitude !== undefined,
    );
  }, [data?.properties]);

  if (isLoading) {
    return (
      <div className="h-[480px] rounded-xl border bg-card flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[480px] rounded-xl border bg-card flex flex-col items-center justify-center gap-4">
        <AlertCircleIcon className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-1">
            Kunde inte ladda kartan
          </h3>
          <p className="text-sm text-muted-foreground">
            Försök igen senare eller kontakta support om problemet kvarstår.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[480px] rounded-xl overflow-hidden mb-8">
      <PropertyMap properties={properties} />
    </div>
  );
};

export default FritidsMap;
