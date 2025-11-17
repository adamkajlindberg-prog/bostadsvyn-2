import { Loader2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PropertyMap from "./PropertyMap";

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

const RentalMap: React.FC<RentalMapProps> = ({
  search,
  minRent,
  maxRent,
  type,
  sort = "latest",
  selectedLocation,
}) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRentalProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadRentalProperties]);

  const loadRentalProperties = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "FOR_RENT")
        .not("latitude", "is", null)
        .not("longitude", "is", null);

      if (type && type !== "ALL") {
        query = query.eq("property_type", type);
      }
      if (typeof minRent === "number") {
        query = query.gte("price", minRent);
      }
      if (typeof maxRent === "number") {
        query = query.lte("price", maxRent);
      }
      if (search && search.trim().length > 0) {
        const s = search.trim();
        query = query.or(
          `title.ilike.%${s}%,address_city.ilike.%${s}%,address_street.ilike.%${s}%`,
        );
      }

      switch (sort) {
        case "price_asc":
          query = query.order("price", { ascending: true });
          break;
        case "price_desc":
          query = query.order("price", { ascending: false });
          break;
        case "area_asc":
          query = query.order("area", { ascending: true });
          break;
        case "area_desc":
          query = query.order("area", { ascending: false });
          break;
        case "rooms_asc":
          query = query.order("rooms", { ascending: true });
          break;
        case "rooms_desc":
          query = query.order("rooms", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      setProperties(data || []);
    } catch (error) {
      console.error("Error loading rental properties for map:", error);
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
      <PropertyMap
        properties={properties}
        selectedLocation={selectedLocation}
      />
    </div>
  );
};

export default RentalMap;
