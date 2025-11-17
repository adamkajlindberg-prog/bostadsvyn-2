import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard, { type Property } from "./PropertyCard";

interface SimilarPropertiesProps {
  currentProperty: {
    id: string;
    address_city: string;
    property_type: string;
    price: number;
    status: string;
  };
}

export default function SimilarProperties({
  currentProperty,
}: SimilarPropertiesProps) {
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSimilarProperties();
  }, [fetchSimilarProperties]);

  const fetchSimilarProperties = async () => {
    try {
      setIsLoading(true);

      // Calculate price range (±30%)
      const minPrice = currentProperty.price * 0.7;
      const maxPrice = currentProperty.price * 1.3;

      // Fetch similar properties with the same criteria
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("address_city", currentProperty.address_city)
        .eq("property_type", currentProperty.property_type)
        .eq("status", currentProperty.status) // Only show properties with same status
        .neq("id", currentProperty.id) // Exclude current property
        .gte("price", minPrice)
        .lte("price", maxPrice)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching similar properties:", error);
        return;
      }

      setSimilarProperties((data || []) as unknown as Property[]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if no similar properties found
  if (!isLoading && similarProperties.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Liknande bostäder</h2>
        <p className="text-muted-foreground">
          Baserat på område, pris och bostadstyp
        </p>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {similarProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              forceWide={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
