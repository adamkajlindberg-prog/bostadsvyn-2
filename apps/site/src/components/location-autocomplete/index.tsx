"use client";

import { Building, Home, MapPin } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";

export interface LocationSuggestion {
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const fetchSuggestions = useCallback(
    async (queryRaw: string | null | undefined) => {
      const query = (queryRaw ?? "").toString();
      if (query.length < 1) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        // Search properties for addresses and cities
        const data = await trpc.property.search.query({
          query: query,
        });

        const allSuggestions: LocationSuggestion[] = [];

        if (data.properties) {
          // Extract unique cities
          const citySet = new Set<string>();
          const addressSet = new Set<string>();

          data.properties.forEach((prop) => {
            // Add city as municipality suggestion
            if (prop.addressCity && !citySet.has(prop.addressCity)) {
              citySet.add(prop.addressCity);
              allSuggestions.push({
                id: `city-${prop.addressCity}`,
                name: prop.addressCity,
                type: "municipality",
                fullName: prop.addressCity,
                center_lat: prop.latitude ? Number(prop.latitude) : undefined,
                center_lng: prop.longitude ? Number(prop.longitude) : undefined,
              });
            }

            // Add street address
            if (
              prop.addressStreet &&
              prop.addressCity &&
              !addressSet.has(`${prop.addressStreet}, ${prop.addressCity}`)
            ) {
              const addressKey = `${prop.addressStreet}, ${prop.addressCity}`;
              addressSet.add(addressKey);
              allSuggestions.push({
                id: `addr-${prop.addressStreet}-${prop.addressCity}`,
                name: prop.addressStreet,
                type: "address",
                fullName: addressKey,
                municipality: prop.addressCity,
                center_lat: prop.latitude ? Number(prop.latitude) : undefined,
                center_lng: prop.longitude ? Number(prop.longitude) : undefined,
              });
            }
          });
        }

        // Sort by category: municipalities, then addresses
        const municipalities = allSuggestions.filter(
          (s) => s.type === "municipality",
        );
        const addresses = allSuggestions.filter((s) => s.type === "address");
        const ordered = [...municipalities, ...addresses];
        setSuggestions(ordered.slice(0, 12));
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(inputValue);
    }, 150);
    return () => clearTimeout(timeoutId);
  }, [inputValue, fetchSuggestions]);

  const handleInputChange = (newValue: string) => {
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
      return;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && !open && suggestions.length > 0) {
      setOpen(true);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleFocus = () => {
    if (suggestions.length > 0 && inputValue.length >= 1) {
      setOpen(true);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={() => {
          // Delay to allow click on suggestion
          setTimeout(() => setOpen(false), 200);
        }}
      />

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
                          <button
                            key={location.id}
                            type="button"
                            onClick={() => handleSelect(location)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleSelect(location);
                              }
                            }}
                            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground border-b border-border last:border-b-0 w-full text-left"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
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
                          </button>
                        );
                      })}
                    </div>
                  );
                return (
                  <div>
                    {renderGroup("Kommuner", municipalities)}
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
