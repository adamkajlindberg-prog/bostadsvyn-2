"use client";

import { Building, Home, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

// Simplified location autocomplete - uses a basic search
// In production, this would call a server action to search locations
export function LocationAutocomplete({
  placeholder = "Sök plats...",
  value = "",
  onChange,
  onSelect,
  className,
}: LocationAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [_loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Simplified: Just show some common Swedish cities as suggestions
  // In production, this would call a server action
  const fetchSuggestions = async (query: string) => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      // Common Swedish cities/municipalities
      const commonLocations: LocationSuggestion[] = [
        {
          id: "stockholm",
          name: "Stockholm",
          type: "municipality",
          fullName: "Stockholm kommun",
          center_lat: 59.3293,
          center_lng: 18.0686,
        },
        {
          id: "goteborg",
          name: "Göteborg",
          type: "municipality",
          fullName: "Göteborg kommun",
          center_lat: 57.7089,
          center_lng: 11.9746,
        },
        {
          id: "malmo",
          name: "Malmö",
          type: "municipality",
          fullName: "Malmö kommun",
          center_lat: 55.6059,
          center_lng: 13.0007,
        },
        {
          id: "uppsala",
          name: "Uppsala",
          type: "municipality",
          fullName: "Uppsala kommun",
          center_lat: 59.8586,
          center_lng: 17.6389,
        },
        {
          id: "vasteras",
          name: "Västerås",
          type: "municipality",
          fullName: "Västerås kommun",
          center_lat: 59.6099,
          center_lng: 16.5448,
        },
      ];

      const filtered = commonLocations.filter((loc) =>
        loc.name.toLowerCase().includes(query.toLowerCase()),
      );

      setSuggestions(filtered);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
    fetchSuggestions(newValue);
    if (newValue.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleSelect = (location: LocationSuggestion) => {
    setInputValue(location.fullName);
    onChange?.(location.fullName);
    onSelect?.(location);
    setOpen(false);
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => {
              if (suggestions.length > 0) {
                setOpen(true);
              }
            }}
          />
        </PopoverTrigger>
        {suggestions.length > 0 && (
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <div className="max-h-[300px] overflow-y-auto">
              {suggestions.map((suggestion) => {
                const Icon = getLocationIcon(suggestion.type);
                return (
                  <button
                    type="button"
                    key={suggestion.id}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-muted cursor-pointer w-full text-left"
                    onClick={() => handleSelect(suggestion)}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {suggestion.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getLocationTypeLabel(suggestion.type)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
