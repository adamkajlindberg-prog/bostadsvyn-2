import { Loader2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { TEST_FRITIDS_PROPERTIES } from "@/data/testFritidsProperties";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard, { type Property } from "./PropertyCard";

interface FritidsPropertiesProps {
  search?: string;
  type?: string;
  environment?: string;
  minPrice?: number;
  maxPrice?: number;
}

const FritidsProperties: React.FC<FritidsPropertiesProps> = ({
  search,
  type,
  environment,
  minPrice,
  maxPrice,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFritidsProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadFritidsProperties]);

  const loadFritidsProperties = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from("properties")
        .select("*")
        .in("property_type", ["COTTAGE", "PLOT"])
        .in("status", ["FOR_SALE", "COMING_SOON"]);

      if (type && type !== "ALL") {
        query = query.eq("property_type", type);
      }
      if (typeof minPrice === "number") {
        query = query.gte("price", minPrice);
      }
      if (typeof maxPrice === "number") {
        query = query.lte("price", maxPrice);
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

      if (data && data.length > 0) {
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
          return 0;
        });

        setProperties(transformedData as any);
      } else {
        // Use test data if no real properties
        setProperties(TEST_FRITIDS_PROPERTIES);
      }
    } catch (error) {
      console.error("Error loading fritids properties:", error);
      // Use test data on error
      setProperties(TEST_FRITIDS_PROPERTIES);
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
          Inga fritidshus eller tomter tillgängliga just nu.
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

export default FritidsProperties;
