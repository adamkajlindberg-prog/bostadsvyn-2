"use client";

import { useQuery } from "@tanstack/react-query";
import type { Property } from "db";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import PropertyMap from "@/components/property-map";
import { useTRPC } from "@/trpc/client";

type SortOption = "latest" | "price_asc" | "price_desc";

interface NyproduktionMapProps {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  sort?: SortOption;
}

const NyproduktionMap: React.FC<NyproduktionMapProps> = ({
  search,
  minPrice,
  maxPrice,
  type,
  sort = "latest",
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

    // Filter to only COMING_SOON properties with coordinates
    return data.properties.filter(
      (p) =>
        p.status === "COMING_SOON" &&
        p.latitude !== null &&
        p.latitude !== undefined &&
        p.longitude !== null &&
        p.longitude !== undefined,
    ) as Property[];
  }, [data]);

  if (isLoading) {
    return (
      <div className="h-[480px] rounded-xl border bg-card flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[480px] rounded-xl overflow-hidden">
      <PropertyMap properties={properties} />
    </div>
  );
};

export default NyproduktionMap;
