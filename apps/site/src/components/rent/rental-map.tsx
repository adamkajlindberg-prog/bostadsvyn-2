"use client";

import { useQuery } from "@tanstack/react-query";
import type { Property } from "db";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import PropertyMap from "@/components/property-map";
import { useTRPC } from "@/trpc/client";

type SortOption =
  | "latest"
  | "price_asc"
  | "price_desc"
  | "area_asc"
  | "area_desc"
  | "rooms_asc"
  | "rooms_desc";

interface RentalMapProps {
  search?: string;
  minRent?: number;
  maxRent?: number;
  type?: string;
  sort?: SortOption;
  selectedLocation?: {
    center_lat?: number;
    center_lng?: number;
    name?: string;
    type?: string;
  };
}

const RentalMap = ({
  search,
  minRent,
  maxRent,
  type,
  sort = "latest",
  selectedLocation,
}: RentalMapProps) => {
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

    // Filter to only FOR_RENT properties with coordinates
    return data.properties.filter(
      (p) =>
        p.status === "FOR_RENT" &&
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
      <PropertyMap
        properties={properties}
        selectedLocation={selectedLocation}
      />
    </div>
  );
};

export default RentalMap;
