import { Loader2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PropertyMap from "./PropertyMap";

interface FritidsMapProps {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  environment?: string;
}

const FritidsMap: React.FC<FritidsMapProps> = ({
  search,
  minPrice,
  maxPrice,
  type,
  environment,
}) => {
  const [properties, setProperties] = useState<any[]>([]);
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
        .in("status", ["FOR_SALE", "COMING_SOON"])
        .not("latitude", "is", null)
        .not("longitude", "is", null);

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

      setProperties(data || []);
    } catch (error) {
      console.error("Error loading fritids properties for map:", error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

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

export default FritidsMap;
