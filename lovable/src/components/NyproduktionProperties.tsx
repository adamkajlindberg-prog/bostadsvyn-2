import { createClient } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";

const supabaseUrl = "https://evgzebvzrihsqfqhmwxo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2Z3plYnZ6cmloc3FmcWhtd3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0ODQ4MjQsImV4cCI6MjA3NDA2MDgyNH0.278oaiUZQFbQUk6IhLsTCvxUmN7Og3jTOrNw18I1sXs";

interface NyproduktionPropertiesProps {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  sort?: "latest" | "price_asc" | "price_desc";
  onCountChange?: (count: number) => void;
}

const NyproduktionProperties: React.FC<NyproduktionPropertiesProps> = ({
  search = "",
  minPrice,
  maxPrice,
  type = "ALL",
  sort = "latest",
  onCountChange,
}) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNyproduktionProperties();
  }, [loadNyproduktionProperties]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const applyFilters = () => {
    let filtered = [...properties];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchLower) ||
          p.address_city?.toLowerCase().includes(searchLower) ||
          p.address_street?.toLowerCase().includes(searchLower),
      );
    }

    // Price filter
    if (minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= maxPrice);
    }

    // Type filter
    if (type && type !== "ALL") {
      filtered = filtered.filter((p) => p.property_type === type);
    }

    // Sort
    const tierPriority = {
      premium: 3,
      plus: 2,
      free: 1,
    };

    // First sort by ad_tier
    filtered.sort((a, b) => {
      const aTierPriority = tierPriority[a.ad_tier || "free"];
      const bTierPriority = tierPriority[b.ad_tier || "free"];
      if (aTierPriority !== bTierPriority) {
        return bTierPriority - aTierPriority; // Higher priority first
      }

      // Then apply user's selected sort
      if (sort === "price_asc") {
        return a.price - b.price;
      } else if (sort === "price_desc") {
        return b.price - a.price;
      } else {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    });

    setFilteredProperties(filtered);
    onCountChange?.(filtered.length);
  };

  const loadNyproduktionProperties = async () => {
    try {
      const client = createClient(supabaseUrl, supabaseKey);

      // Create mock properties with nyproduktion
      const mockProperties = [
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          title: "Arkitektritad sekelskiftesvåning",
          price: 24900000,
          address_street: "Östermalmsvägen 12",
          address_postal_code: "114 33",
          address_city: "Stockholm",
          property_type: "Lägenhet",
          status: "COMING_SOON",
          rooms: 7,
          living_area: 198,
          bedrooms: 4,
          bathrooms: 2,
          monthly_fee: 12400,
          latitude: 59.335,
          longitude: 18.088,
          images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=675&fit=crop",
          ],
          created_at: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          user_id: "test",
          ad_tier: "premium",
          is_nyproduktion: true,
          description:
            "Extraordinär sekelskiftesvåning med ursprungliga detaljer och modern komfort.",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440005",
          title: "Charmigt radhus med trädgård",
          price: 8450000,
          address_street: "Parkvägen 23",
          address_postal_code: "131 52",
          address_city: "Nacka",
          property_type: "Radhus",
          status: "COMING_SOON",
          rooms: 5,
          living_area: 135,
          bedrooms: 3,
          bathrooms: 2,
          monthly_fee: 3100,
          latitude: 59.31,
          longitude: 18.16,
          images: [
            "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
          ],
          created_at: new Date(
            Date.now() - 14 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          user_id: "test",
          ad_tier: "plus",
          is_nyproduktion: true,
          description:
            "Trevligt radhus i barnvänligt område. Egen trädgård, nyrenoverat kök.",
        },
      ];

      const response = await client
        .from("properties")
        .select("*")
        .eq("is_nyproduktion", true)
        .in("status", ["FOR_SALE", "COMING_SOON"])
        .order("created_at", { ascending: false });

      if (response.error) {
        console.error("Error loading nyproduktion:", response.error);
        setProperties(mockProperties);
        return;
      }

      // Combine mock properties with real properties
      const allProperties = [...mockProperties, ...(response.data || [])];
      setProperties(allProperties);
    } catch (error) {
      console.error("Error loading nyproduktion properties:", error);
      setProperties([]);
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

  if (filteredProperties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {isLoading
            ? "Laddar..."
            : "Inga nyproduktionsobjekt hittades med dina filter."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {filteredProperties.map((property: any) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default NyproduktionProperties;
