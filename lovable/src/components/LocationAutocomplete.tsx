import { Building, Home, MapPin } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LocationSuggestion {
  id: string;
  name: string;
  type: "address" | "municipality" | "district";
  fullName: string;
  municipality?: string;
  center_lat?: number;
  center_lng?: number;
}
interface LocationAutocompleteProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (location: LocationSuggestion) => void;
  className?: string;
}
const getLocationIcon = (type: LocationSuggestion["type"]) => {
  switch (type) {
    case "address":
      return Home;
    case "municipality":
      return Building;
    case "district":
      return MapPin;
    default:
      return MapPin;
  }
};
const getLocationTypeLabel = (type: LocationSuggestion["type"]) => {
  switch (type) {
    case "address":
      return "Adress";
    case "municipality":
      return "Kommun";
    case "district":
      return "Område";
    default:
      return "";
  }
};
export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  placeholder = "Sök plats...",
  value = "",
  onChange,
  onSelect,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const _inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  const fetchSuggestions = async (queryRaw: string | null | undefined) => {
    const query = (queryRaw ?? "").toString();
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      // Always search geographic areas first (municipalities and districts)
      const { data: areas } = await supabase
        .from("geographic_areas")
        .select("id, name, area_type, center_lat, center_lng")
        .ilike("name", `%${query}%`)
        .in("area_type", ["municipality", "district"])
        .limit(8);
      const allSuggestions: LocationSuggestion[] = [];

      // Add geographic areas
      if (areas && areas.length > 0) {
        areas.forEach((area) => {
          const isMunicipality = area.area_type === "municipality";
          const baseName = area.name?.trim() || "";
          const muniName = isMunicipality
            ? `${baseName.replace(/\s*kommun\s*$/i, "").trim()} kommun`
            : baseName;
          const fullName = muniName;
          allSuggestions.push({
            id: area.id,
            name: muniName,
            type: isMunicipality ? "municipality" : "district",
            fullName,
            center_lat: area.center_lat ? Number(area.center_lat) : undefined,
            center_lng: area.center_lng ? Number(area.center_lng) : undefined,
          });
        });
      }

      // Try to search property addresses for street names (optional, won't block if no properties)
      try {
        const { data: properties } = await supabase
          .from("properties")
          .select("address_street, address_city, latitude, longitude")
          .or(`address_street.ilike.%${query}%, address_city.ilike.%${query}%`)
          .limit(6);

        // Search property sales history for additional addresses
        const { data: salesHistory } = await supabase
          .from("property_sales_history")
          .select("address_street, address_city, latitude, longitude")
          .or(`address_street.ilike.%${query}%, address_city.ilike.%${query}%`)
          .limit(6);

        // Add unique street addresses from properties
        const addressSet = new Set<string>();
        if (properties) {
          properties.forEach((prop) => {
            if (!prop.address_street || !prop.address_city) return;
            const addressKey = `${prop.address_street}, ${prop.address_city}`;
            if (
              !addressSet.has(addressKey) &&
              prop.address_street.toLowerCase().includes(query.toLowerCase())
            ) {
              addressSet.add(addressKey);
              allSuggestions.push({
                id: `prop-${prop.address_street}-${prop.address_city}`,
                name: prop.address_street,
                type: "address",
                fullName: addressKey,
                municipality: prop.address_city,
                center_lat: prop.latitude ? Number(prop.latitude) : undefined,
                center_lng: prop.longitude ? Number(prop.longitude) : undefined,
              });
            }
          });
        }

        // Add unique street addresses from sales history
        if (salesHistory) {
          salesHistory.forEach((sale) => {
            if (!sale.address_street || !sale.address_city) return;
            const addressKey = `${sale.address_street}, ${sale.address_city}`;
            if (
              !addressSet.has(addressKey) &&
              sale.address_street.toLowerCase().includes(query.toLowerCase())
            ) {
              addressSet.add(addressKey);
              allSuggestions.push({
                id: `sale-${sale.address_street}-${sale.address_city}`,
                name: sale.address_street,
                type: "address",
                fullName: addressKey,
                municipality: sale.address_city,
                center_lat: sale.latitude ? Number(sale.latitude) : undefined,
                center_lng: sale.longitude ? Number(sale.longitude) : undefined,
              });
            }
          });
        }
      } catch (_propertyError) {
        console.log(
          "No properties found, continuing with geographic areas only",
        );
      }

      // Augment with OSM suggestions via edge function for broader coverage (Täby, Vasastan, etc.)
      try {
        const lower = query.toLowerCase();
        const typeHint = lower.includes("kommun")
          ? "municipality"
          : lower.includes("stadsdel") || lower.includes("område")
            ? "district"
            : undefined;
        const { data, error } = await supabase.functions.invoke(
          "osm-boundary",
          {
            body: {
              q: query,
              list: true,
              type: typeHint as any,
            },
          },
        );
        if (error) {
          console.warn(
            "OSM suggestions error:",
            (error as any).message || error,
          );
        } else if (data && Array.isArray((data as any).suggestions)) {
          const suggestionsFromOsm = (data as any)
            .suggestions as LocationSuggestion[];
          suggestionsFromOsm.forEach((s: LocationSuggestion) => {
            allSuggestions.push(s);
          });
        }
      } catch (e) {
        console.warn("OSM invoke failed:", e);
      }

      // Normalize, categorize and de-duplicate
      const normalized: LocationSuggestion[] = [];
      const seenKeys = new Set<string>();
      const toKey = (s: LocationSuggestion) => {
        if (s.type === "municipality") {
          const base = s.name
            .replace(/\s*kommun\s*$/i, "")
            .trim()
            .toLowerCase();
          return `muni|${base}`;
        }
        if (s.type === "district") {
          const muni = (s.municipality || "").trim().toLowerCase();
          return `dist|${s.name.trim().toLowerCase()}|${muni}`;
        }
        const muni = (s.municipality || "").trim().toLowerCase();
        return `addr|${s.name.trim().toLowerCase()}|${muni}`;
      };
      for (const s of allSuggestions) {
        const item = {
          ...s,
        } as LocationSuggestion;
        if (item.type === "municipality") {
          const pretty = `${(item.name || "").replace(/\s*kommun\s*$/i, "").trim()} kommun`;
          item.name = pretty;
          item.fullName = pretty;
        }
        if (item.type === "district") {
          if (item.municipality) {
            item.fullName = `${item.name}, ${item.municipality}`;
          } else {
            item.fullName = item.fullName || item.name;
          }
        }
        if (item.type === "address") {
          if (item.municipality) {
            item.fullName = `${item.name}, ${item.municipality}`;
          } else {
            item.fullName = item.fullName || item.name;
          }
        }
        const key = toKey(item);
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          normalized.push(item);
        }
      }

      // Sort by category: municipalities, districts, then addresses
      const municipalities = normalized.filter(
        (s) => s.type === "municipality",
      );
      const districts = normalized.filter((s) => s.type === "district");
      const addresses = normalized.filter((s) => s.type === "address");
      const ordered = [...municipalities, ...districts, ...addresses];
      setSuggestions(ordered.slice(0, 12));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(inputValue);
    }, 150);
    return () => clearTimeout(timeoutId);
  }, [inputValue, fetchSuggestions]);
  const _handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    onChange?.(newValue);
    if (newValue.length >= 1) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };
  const handleSelect = (location: LocationSuggestion) => {
    setInputValue(location.fullName);
    setOpen(false);
    onChange?.(location.fullName);

    // Call onSelect callback if provided
    if (onSelect) {
      onSelect(location);
      // Don't navigate if onSelect is provided (let parent handle it)
      return;
    }

    // Navigate to search results page only if no onSelect callback
    const searchParams = new URLSearchParams({
      location: location.fullName,
      locationData: encodeURIComponent(JSON.stringify(location)),
    });
    window.location.href = `/search-results?${searchParams.toString()}`;
  };
  const _handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && !open && suggestions.length > 0) {
      setOpen(true);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
    if (e.key === "Enter") {
      const q = inputValue.trim();
      if (q) {
        setOpen(false);
        const params = new URLSearchParams({
          location: q,
        });
        window.location.href = `/search-results?${params.toString()}`;
      }
    }
  };
  const _handleFocus = () => {
    if (suggestions.length > 0 && inputValue.length >= 1) {
      setOpen(true);
    }
  };
  return (
    <div className="relative">
      {/* Suggestions dropdown */}
      {open && (suggestions.length > 0 || loading) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-[340px] overflow-y-auto">
          {loading && (
            <div className="p-3 text-center text-sm text-muted-foreground">
              Söker...
            </div>
          )}
          {!loading && suggestions.length > 0 && (
            <div>
              {(() => {
                const municipalities = suggestions.filter(
                  (s) => s.type === "municipality",
                );
                const districts = suggestions.filter(
                  (s) => s.type === "district",
                );
                const addresses = suggestions.filter(
                  (s) => s.type === "address",
                );
                const renderGroup = (
                  label: string,
                  items: LocationSuggestion[],
                ) =>
                  items.length > 0 && (
                    <div>
                      <div className="px-3 pt-2 pb-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                        {label}
                      </div>
                      {items.map((location) => {
                        const Icon = getLocationIcon(location.type);
                        return (
                          <div
                            key={location.id}
                            onClick={() => handleSelect(location)}
                            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground border-b border-border last:border-b-0"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm">
                                {location.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {location.municipality &&
                                  location.municipality !== location.name && (
                                    <span>{location.municipality} • </span>
                                  )}
                                <span>
                                  {getLocationTypeLabel(location.type)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                return (
                  <div>
                    {renderGroup("Kommuner", municipalities)}
                    {renderGroup("Områden", districts)}
                    {renderGroup("Gator & adresser", addresses)}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* No results message */}
      {open &&
        !loading &&
        suggestions.length === 0 &&
        inputValue.length >= 1 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-md shadow-lg p-3">
            <div className="text-sm text-muted-foreground text-center">
              Inga platser hittades.
            </div>
          </div>
        )}
    </div>
  );
};
