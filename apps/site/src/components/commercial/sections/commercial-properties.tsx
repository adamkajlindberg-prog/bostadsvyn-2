"use client";

import { useQuery } from "@tanstack/react-query";
import type { Property } from "db";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import PropertyCard from "@/components/property-card";
import { Badge } from "@/components/ui/badge";
import { useTRPC } from "@/trpc/client";

const CommercialProperties = () => {
  const trpc = useTRPC();

  // Build search filters for commercial properties
  const searchFilters = useMemo(() => {
    return {
      propertyType: "COMMERCIAL",
    };
  }, []);

  const { data, isLoading } = useQuery(
    trpc.property.search.queryOptions(searchFilters),
  );

  const properties: Property[] = useMemo(() => {
    if (!data?.properties) return [];

    // Filter to only commercial properties with active statuses
    const filtered = data.properties.filter(
      (p) =>
        p.propertyType === "COMMERCIAL" &&
        ["FOR_SALE", "FOR_RENT", "COMING_SOON"].includes(p.status),
    ) as Property[];

    // Sort by ad_tier (premium > plus > free) first, then by creation date
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

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Utvalda kommersiella fastigheter</h2>
          <Badge variant="outline">Exklusiva objekt</Badge>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (properties.length === 0) {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Utvalda kommersiella fastigheter</h2>
          <Badge variant="outline">Exklusiva objekt</Badge>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Inga kommersiella fastigheter tillgängliga just nu.
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Utvalda kommersiella fastigheter</h2>
        <Badge variant="outline">Exklusiva objekt</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default CommercialProperties;
