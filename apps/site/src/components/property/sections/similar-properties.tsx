"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import PropertyCard from "@/components/property-card";
import { Card, CardContent } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";

interface SimilarPropertiesProps {
  currentProperty?: {
    id: string;
  };
}

const SimilarProperties = ({ currentProperty }: SimilarPropertiesProps) => {
  const trpc = useTRPC();

  const { data, isLoading } = useQuery({
    ...trpc.property.similar.queryOptions({
      propertyId: currentProperty?.id ?? "",
    }),
    enabled: !!currentProperty?.id,
  });

  const similarProperties = data?.properties ?? [];

  if (!currentProperty) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="py-6 shadow-xs">
        <CardContent className="px-6">
          <div className="text-xl @lg:text-2xl font-semibold tracking-tight mb-4">
            Liknande fastigheter
          </div>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (similarProperties.length === 0) {
    return null;
  }

  return (
    <Card className="py-6 shadow-xs">
      <CardContent className="px-6">
        <div className="text-xl @lg:text-2xl font-semibold tracking-tight mb-4">
          Liknande fastigheter
        </div>

        <div className="grid grid-cols-1 gap-6">
          {similarProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimilarProperties;
