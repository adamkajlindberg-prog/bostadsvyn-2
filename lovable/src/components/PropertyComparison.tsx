import {
  Bath,
  BedDouble,
  Calendar,
  DollarSign,
  Home,
  MapPin,
  Plus,
  Ruler,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  title: string;
  property_type: string;
  price: number;
  status: string;
  address_street: string;
  address_city: string;
  living_area?: number;
  plot_area?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  year_built?: number;
  monthly_fee?: number;
  energy_class?: string;
  features?: string[];
  images?: string[];
}

interface PropertyComparisonProps {
  propertyIds: string[];
  onRemoveProperty: (propertyId: string) => void;
  onAddProperty: () => void;
  maxProperties?: number;
}

const comparisonFields = [
  {
    key: "price",
    label: "Pris (SEK)",
    icon: DollarSign,
    format: (value: number) => `${value.toLocaleString("sv-SE")} kr`,
  },
  { key: "property_type", label: "Typ", icon: Home },
  {
    key: "living_area",
    label: "Boarea (m²)",
    icon: Ruler,
    format: (value: number) => `${value} m²`,
  },
  {
    key: "plot_area",
    label: "Tomtarea (m²)",
    icon: Ruler,
    format: (value: number) => `${value} m²`,
  },
  { key: "rooms", label: "Rum", icon: Home },
  { key: "bedrooms", label: "Sovrum", icon: BedDouble },
  { key: "bathrooms", label: "Badrum", icon: Bath },
  { key: "year_built", label: "Byggår", icon: Calendar },
  {
    key: "monthly_fee",
    label: "Månadsavgift",
    icon: DollarSign,
    format: (value: number) => `${value.toLocaleString("sv-SE")} kr/mån`,
  },
  { key: "energy_class", label: "Energiklass", icon: Zap },
];

export const PropertyComparison: React.FC<PropertyComparisonProps> = ({
  propertyIds,
  onRemoveProperty,
  onAddProperty,
  maxProperties = 4,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (propertyIds.length > 0) {
      loadProperties();
    } else {
      setProperties([]);
      setLoading(false);
    }
  }, [propertyIds, loadProperties]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .in("id", propertyIds)
        .in("status", ["FOR_SALE", "FOR_RENT", "COMING_SOON"]);

      if (error) throw error;

      // Sort properties in the same order as propertyIds
      const sortedProperties = propertyIds
        .map((id) => data?.find((p) => p.id === id))
        .filter(Boolean) as Property[];

      setProperties(sortedProperties);
    } catch (_error: any) {
      toast({
        title: "Fel",
        description: "Kunde inte ladda fastigheter för jämförelse",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPricePerSqm = (property: Property) => {
    if (!property.living_area) return null;
    return Math.round(property.price / property.living_area);
  };

  const getBestValue = (field: string) => {
    if (properties.length < 2) return null;

    const values = properties
      .map((p) => (p as any)[field])
      .filter((v) => v !== null && v !== undefined);

    if (values.length === 0) return null;

    switch (field) {
      case "price":
      case "monthly_fee":
        return Math.min(...values);
      case "living_area":
      case "plot_area":
      case "rooms":
      case "bedrooms":
      case "bathrooms":
        return Math.max(...values);
      case "year_built":
        return Math.max(...values);
      default:
        return null;
    }
  };

  const isHighlighted = (property: Property, field: string) => {
    const bestValue = getBestValue(field);
    if (bestValue === null) return false;
    return (property as any)[field] === bestValue;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Laddar jämförelse...</p>
        </CardContent>
      </Card>
    );
  }

  if (properties.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Jämför fastigheter</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Ingen jämförelse aktiv</h3>
          <p className="text-muted-foreground mb-4">
            Lägg till fastigheter för att jämföra deras egenskaper sida vid
            sida.
          </p>
          <Button onClick={onAddProperty}>
            <Plus className="h-4 w-4 mr-2" />
            Lägg till fastighet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Fastighetsjämförelse</h2>
          <p className="text-muted-foreground">
            Jämför {properties.length} fastighet
            {properties.length !== 1 ? "er" : ""}
          </p>
        </div>

        {properties.length < maxProperties && (
          <Button onClick={onAddProperty}>
            <Plus className="h-4 w-4 mr-2" />
            Lägg till fastighet
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Property Headers */}
          <div
            className="grid gap-4 mb-6"
            style={{
              gridTemplateColumns: `300px repeat(${properties.length}, 250px)`,
            }}
          >
            <div></div>
            {properties.map((property) => (
              <Card key={property.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() => onRemoveProperty(property.id)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="aspect-video bg-muted relative overflow-hidden rounded-t-lg">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Home className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate">
                      {property.address_street}, {property.address_city}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {property.price.toLocaleString("sv-SE")} kr
                  </div>
                  {property.living_area && (
                    <div className="text-xs text-muted-foreground">
                      {getPricePerSqm(property)?.toLocaleString("sv-SE")} kr/m²
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparison Table */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {comparisonFields.map((field, _index) => {
                  const Icon = field.icon;
                  return (
                    <div
                      key={field.key}
                      className="grid gap-4 p-4"
                      style={{
                        gridTemplateColumns: `300px repeat(${properties.length}, 250px)`,
                      }}
                    >
                      <div className="flex items-center gap-2 font-medium">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {field.label}
                      </div>

                      {properties.map((property) => {
                        const value = (property as any)[field.key];
                        const highlighted = isHighlighted(property, field.key);

                        return (
                          <div
                            key={property.id}
                            className={`flex items-center justify-center p-2 rounded ${
                              highlighted
                                ? "bg-success/10 text-success font-semibold"
                                : ""
                            }`}
                          >
                            {value !== null && value !== undefined ? (
                              field.format ? (
                                field.format(value)
                              ) : (
                                value
                              )
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                            {highlighted && (
                              <TrendingUp className="h-3 w-3 ml-1" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Features Comparison */}
                <div
                  className="grid gap-4 p-4"
                  style={{
                    gridTemplateColumns: `300px repeat(${properties.length}, 250px)`,
                  }}
                >
                  <div className="font-medium">Egenskaper</div>
                  {properties.map((property) => (
                    <div key={property.id} className="space-y-1">
                      {property.features && property.features.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {property.features.slice(0, 3).map((feature) => (
                            <Badge
                              key={feature}
                              variant="secondary"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                          {property.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{property.features.length - 3}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Inga angivna
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Sammanfattning</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${properties.length}, 1fr)`,
                }}
              >
                {properties.map((property) => {
                  const pricePerSqm = getPricePerSqm(property);
                  const highlights = comparisonFields.filter((field) =>
                    isHighlighted(property, field.key),
                  ).length;

                  return (
                    <div key={property.id} className="text-center space-y-2">
                      <h4 className="font-semibold text-sm">
                        {property.title}
                      </h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {pricePerSqm && (
                          <div>
                            Pris per m²: {pricePerSqm.toLocaleString("sv-SE")}{" "}
                            kr
                          </div>
                        )}
                        <div className="flex items-center justify-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {highlights} bästa värden
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
