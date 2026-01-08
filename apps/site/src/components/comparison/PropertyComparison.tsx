"use client";

import { useQuery } from "@tanstack/react-query";
import type { Property } from "db";
import { BarChart3, Home, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTRPC } from "@/trpc/client";
import type { T_Property_Search_Input } from "@/trpc/routes/property-search";

const PropertyComparison = () => {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilters, setSearchFilters] = useState<T_Property_Search_Input>({
    query: "",
  });

  const trpc = useTRPC();

  const {
    data: searchData,
    isLoading: isLoadingSearch,
    isFetching: isFetchingSearch,
  } = useQuery(
    trpc.propertySearch.search.queryOptions(
      searchFilters.query ? searchFilters : { query: "" },
    ),
  );

  const searchResults: Property[] = searchData?.properties ?? [];
  const loading = isLoadingSearch || isFetchingSearch;

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("sv-SE")} kr`;
  };

  const searchProperties = () => {
    if (!searchTerm.trim()) {
      setSearchFilters({ query: "" });
      return;
    }
    setSearchFilters({ query: searchTerm.trim() });
  };

  const addPropertyToComparison = (property: Property) => {
    if (selectedProperties.length >= 4) {
      toast.error("Du kan jämföra max 4 fastigheter åt gången");
      return;
    }

    if (selectedProperties.find((p) => p.id === property.id)) {
      toast.error("Fastigheten är redan tillagd");
      return;
    }

    setSelectedProperties((prev) => [...prev, property]);
    toast.success("Fastighet tillagd för jämförelse");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Fastighetsjämförelse</h2>
        </div>
        <p className="text-lg text-muted-foreground">
          Jämför fastigheter sida vid sida för att fatta välgrundade beslut
        </p>
      </div>

      {/* Search and Add Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Lägg till fastigheter ({selectedProperties.length}/4)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Sök fastigheter att jämföra..."
              onKeyDown={(e) => e.key === "Enter" && searchProperties()}
            />
            <Button onClick={searchProperties} disabled={loading}>
              {loading ? "Söker..." : "Sök"}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <Label>Sökresultat:</Label>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {searchResults.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{property.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {property.addressStreet}, {property.addressCity}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{formatPrice(property.price)}</span>
                        {property.livingArea && (
                          <span>{property.livingArea} m²</span>
                        )}
                        {property.rooms && <span>{property.rooms} rum</span>}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addPropertyToComparison(property)}
                      disabled={selectedProperties.length >= 4}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Empty State */}
      {selectedProperties.length === 0 && (
        <Card>
          <CardContent className="text-center p-8">
            <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ingen jämförelse aktiverad</h3>
            <p className="text-muted-foreground">
              Sök efter och lägg till fastigheter för att börja jämföra dem.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyComparison;
