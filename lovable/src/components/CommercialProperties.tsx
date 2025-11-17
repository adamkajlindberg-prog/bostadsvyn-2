import { Loader2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard, { type Property } from "./PropertyCard";

interface CommercialPropertiesProps {
  search?: string;
  type?: string;
  status?: string;
  minArea?: number;
  maxArea?: number;
}

const CommercialProperties: React.FC<CommercialPropertiesProps> = ({
  search,
  type,
  status,
  minArea,
  maxArea,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCommercialProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadCommercialProperties]);

  const loadCommercialProperties = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from("properties")
        .select("*")
        .eq("property_type", "COMMERCIAL");

      if (status && status !== "ALL") {
        query = query.eq("status", status);
      } else {
        query = query.in("status", ["FOR_SALE", "FOR_RENT", "COMING_SOON"]);
      }

      if (typeof minArea === "number") {
        query = query.gte("living_area", minArea);
      }
      if (typeof maxArea === "number") {
        query = query.lte("living_area", maxArea);
      }
      if (search && search.trim().length > 0) {
        const s = search.trim();
        query = query.or(
          `title.ilike.%${s}%,address_city.ilike.%${s}%,address_street.ilike.%${s}%`,
        );
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const transformedData = data.map((prop) => ({
          ...prop,
          viewing_times: [],
          images: Array.isArray(prop.images) ? prop.images : [],
          features: Array.isArray(prop.features) ? prop.features : [],
        }));

        // Sort by ad_tier (premium > plus > free) first
        const tierPriority = {
          premium: 3,
          plus: 2,
          free: 1,
        };
        transformedData.sort((a: any, b: any) => {
          const aTierPriority = tierPriority[a.ad_tier || "free"];
          const bTierPriority = tierPriority[b.ad_tier || "free"];
          if (aTierPriority !== bTierPriority) {
            return bTierPriority - aTierPriority; // Higher priority first
          }
          // If same tier, maintain created_at order
          return 0;
        });

        setProperties(transformedData as any);
      }
    } catch (error) {
      console.error("Error loading commercial properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          Inga kommersiella fastigheter tillgängliga just nu.
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

export default CommercialProperties;
