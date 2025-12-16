"use client";

import { useQuery } from "@tanstack/react-query";
import type { Property } from "db";
import {
  ArrowUpDown,
  Brain,
  ChevronDown,
  Filter,
  Grid,
  Home,
  Loader2,
  MapIcon,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { LocationAutocomplete } from "@/components/location-autocomplete";
import PropertyCard from "@/components/property-card";
import PropertyMap from "@/components/property-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/use-debounce";
import { searchPropertyTabs } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import type { T_Property_Search_Input } from "@/trpc/routes/property-search";
import { getCount } from "@/utils/objects";

type ViewMode = "grid" | "map";

const sortOptions = [
  { value: "created_desc", label: "Nyast först" },
  { value: "created_asc", label: "Äldst först" },
  { value: "price_asc", label: "Billigast först" },
  { value: "price_desc", label: "Dyrast först" },
  { value: "living_area_desc", label: "Störst först (m²)" },
  { value: "living_area_asc", label: "Minst först (m²)" },
  { value: "plot_area_desc", label: "Tomt – störst först (m²)" },
  { value: "plot_area_asc", label: "Tomt – minst först (m²)" },
  { value: "price_sqm_desc", label: "Lägst kvadratmeterpris (kr/m²)" },
  { value: "price_sqm_asc", label: "Högst kvadratmeterpris (kr/m²)" },
  { value: "rooms_desc", label: "Flest rum först" },
  { value: "rooms_asc", label: "Minst antal rum först" },
  { value: "fee_desc", label: "Lägst avgift (kr/mån)" },
  { value: "fee_asc", label: "Högst avgift (kr/mån)" },
  { value: "address_desc", label: "Adress A–Ö" },
  { value: "address_asc", label: "Adress Ö–A" },
];

const commonFeatures = [
  "Balkong",
  "Balkong/Terrass",
  "Terrass",
  "Garage",
  "Parkering",
  "Hiss",
  "Vind",
  "Källare",
  "El inkluderat",
  "Värme inkluderat",
  "Internet inkluderat",
];

const energyClasses = ["A", "B", "C", "D", "E", "F", "G"];

const propertyTypeLabels: Record<string, string> = {
  APARTMENT: "Lägenheter",
  HOUSE: "Villor",
  TOWNHOUSE: "Radhus/Parhus/Kedjehus",
  COTTAGE: "Fritidshus",
  PLOT: "Tomter",
  COMMERCIAL: "Kommersiellt",
};

const getFiltersFromParams = (
  params: URLSearchParams,
): T_Property_Search_Input => {
  return {
    query: params.get("query") || "",
    location: params.get("location") || "",
    propertyType: params.get("propertyType") || "",
    listingType: params.get("listingType") || "",
    minPrice: params.get("minPrice")
      ? Number(params.get("minPrice"))
      : undefined,
    maxPrice: params.get("maxPrice")
      ? Number(params.get("maxPrice"))
      : undefined,
    minArea: params.get("minArea") ? Number(params.get("minArea")) : undefined,
    maxArea: params.get("maxArea") ? Number(params.get("maxArea")) : undefined,
    minRooms: params.get("minRooms")
      ? Number(params.get("minRooms"))
      : undefined,
    maxRooms: params.get("maxRooms")
      ? Number(params.get("maxRooms"))
      : undefined,
    features: params.getAll("features"),
    energyClass: params.getAll("energyClass"),
    sortBy: params.get("sortBy") || "",
    minRent: params.get("minRent") ? Number(params.get("minRent")) : undefined,
    maxRent: params.get("maxRent") ? Number(params.get("maxRent")) : undefined,
    minMonthlyFee: params.get("minMonthlyFee")
      ? Number(params.get("minMonthlyFee"))
      : undefined,
    maxMonthlyFee: params.get("maxMonthlyFee")
      ? Number(params.get("maxMonthlyFee"))
      : undefined,
    minPlotArea: params.get("minPlotArea")
      ? Number(params.get("minPlotArea"))
      : undefined,
    maxPlotArea: params.get("maxPlotArea")
      ? Number(params.get("maxPlotArea"))
      : undefined,
  };
};

export default function PropertySearch() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<T_Property_Search_Input>(
    getFiltersFromParams(searchParams),
  );

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeTab, setActiveTab] = useState<
    | "ALL"
    | "FOR_SALE"
    | "FOR_RENT"
    | "COMING_SOON"
    | "SOLD"
    | "COMMERCIAL"
    | "NYPRODUKTION"
  >("ALL");
  const [countryTab, setCountryTab] = useState<"SVERIGE" | "UTOMLANDS">(
    "SVERIGE",
  );
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<
    | {
      center_lat?: number;
      center_lng?: number;
      name?: string;
      type?: string;
    }
    | undefined
  >(undefined);
  const [naturalSearchQuery, setNaturalSearchQuery] = useState("");
  const [activeSearchTab, setActiveSearchTab] = useState("");

  // Separated filter states
  const [locationInput, setLocationInput] = useState(filters.location || "");
  const [minPriceInput, setMinPriceInput] = useState(
    filters.minPrice?.toString() || "",
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    filters.maxPrice?.toString() || "",
  );


  const debouncedLocationUpdate = useDebounce((value: string) => {
    setFilters((prev) => ({
      ...prev,
      location: value,
    }));
  }, 1000);

  const debouncedMinPriceUpdate = useDebounce((value: string) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: value ? Number(value) : undefined,
    }));
  }, 1000);

  const debouncedMaxPriceUpdate = useDebounce((value: string) => {
    setFilters((prev) => ({
      ...prev,
      maxPrice: value ? Number(value) : undefined,
    }));
  }, 1000);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationInput(value);
    debouncedLocationUpdate(value);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPriceInput(value);
    debouncedMinPriceUpdate(value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPriceInput(value);
    debouncedMaxPriceUpdate(value);
  };

  const clearFilters = () => {
    setFilters(getFiltersFromParams(new URLSearchParams()));
    setLocationInput("");
    setSelectedLocation(undefined);
  };

  const trpc = useTRPC();

  const {
    data: searchData,
    isLoading: isLoadingSearchData,
    isFetching: isFetchingSearchData,
  } = useQuery(trpc.propertySearch.search.queryOptions(filters));

  const properties: Property[] = searchData?.properties ?? [];
  const totalResults = searchData?.total ?? 0;

  const handleNaturalSearch = () => {
    if (!naturalSearchQuery || naturalSearchQuery.trim().length === 0) {
      toast.error("Ange en sökfras eller plats");
      return;
    }

    setFilters((prev) => ({ ...prev, query: naturalSearchQuery }));
  };

  const onChangeSearchTab = (value: string) => {
    setActiveSearchTab(value);
    setActiveTab(
      value as
      | "ALL"
      | "FOR_SALE"
      | "FOR_RENT"
      | "COMING_SOON"
      | "SOLD"
      | "COMMERCIAL"
      | "NYPRODUKTION",
    );
    setFilters((prev) => ({ ...prev, listingType: value }));
  };

  if (isLoadingSearchData && !searchData) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p>Laddar fastigheter...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Sök alla fastigheter</h1>
          <p className="text-muted-foreground">
            {isFetchingSearchData
              ? "Söker fastigheter..."
              : `${totalResults} fastigheter hittades`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>

          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
          >
            <MapIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-80">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter
                </CardTitle>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Rensa
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
              {/* AI Smart Search */}
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <Label className="text-sm font-medium">
                    Smart AI-sökning
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Beskriv din drömbostad i naturligt språk.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="T.ex. '3 rum lägenhet i Stockholm'"
                    value={naturalSearchQuery}
                    onChange={(e) => setNaturalSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleNaturalSearch();
                      }
                    }}
                    className="text-sm"
                  />
                  <Button onClick={handleNaturalSearch} size="sm">
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Search */}
              <div>
                <Label>Sök plats</Label>
                <LocationAutocomplete
                  placeholder="Ange stad, kommun eller område"
                  value={filters.location}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, query: value }))
                  }
                  onSelect={(location) => {
                    setFilters((prev) => ({
                      ...prev,
                      query: location.fullName,
                    }));
                    setSelectedLocation({
                      center_lat: location.center_lat,
                      center_lng: location.center_lng,
                      name: location.fullName,
                      type: location.type,
                    });
                  }}
                  className="mt-2"
                />
                <Input
                  placeholder="T.ex. Stockholm"
                  value={locationInput}
                  onChange={handleLocationChange}
                  className="mt-2"
                />
              </div>

              <Separator />

              {/* Property Type */}
              <div>
                <Label>Fastighetstyp</Label>
                <div className="mt-2 space-y-2">
                  {[
                    "APARTMENT",
                    "HOUSE",
                    "TOWNHOUSE",
                    "COTTAGE",
                    "PLOT",
                    "COMMERCIAL",
                  ].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={filters.propertyType === type}
                        onCheckedChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            propertyType:
                              prev.propertyType === type ? "" : type,
                          }))
                        }
                      />
                      <Label htmlFor={type} className="text-sm cursor-pointer">
                        {propertyTypeLabels[type]}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              {filters.listingType !== "FOR_RENT" && (
                <div>
                  <Label>Köpesumma (SEK)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      type="number"
                      placeholder="Från"
                      value={minPriceInput}
                      onChange={handleMinPriceChange}
                    />
                    <Input
                      type="number"
                      placeholder="Till"
                      value={maxPriceInput}
                      onChange={handleMaxPriceChange}
                    />
                  </div>
                </div>
              )}

              {/* Area Range */}
              <div>
                <Label>Boarea (m²)</Label>
                <div className="mt-4 space-y-4">
                  <Slider
                    value={[filters.minArea || 0, filters.maxArea || 1000]}
                    onValueChange={([min, max]) => {
                      setFilters((prev) => ({
                        ...prev,
                        minArea: min,
                        maxArea: max,
                      }));
                    }}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{filters.minArea} m²</span>
                    <span>{filters.maxArea} m²</span>
                  </div>
                </div>
              </div>

              {/* Rooms */}
              <div>
                <Label>Antal rum</Label>
                <div className="mt-4 space-y-4">
                  <Slider
                    value={[filters.minRooms || 0, filters.maxRooms || 10]}
                    onValueChange={([min, max]) => {
                      setFilters((prev) => ({
                        ...prev,
                        minRooms: min,
                        maxRooms: max,
                      }));
                    }}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{filters.minRooms} rum</span>
                    <span>{filters.maxRooms}+ rum</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Advanced Filters Toggle */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {showAdvancedFilters ? "Dölj utökade filter" : "Utökade filter"}
              </Button>

              {showAdvancedFilters && (
                <>
                  <Separator />

                  {/* Features */}
                  <div>
                    <Label>Egenskaper</Label>
                    <div className="mt-2 space-y-2">
                      {commonFeatures.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={feature}
                            checked={filters.features?.includes(feature)}
                            onCheckedChange={() =>
                              setFilters((prev) => ({
                                ...prev,
                                features: prev.features?.includes(feature)
                                  ? prev.features.filter((f) => f !== feature)
                                  : [...(prev.features || []), feature],
                              }))
                            }
                          />
                          <Label htmlFor={feature} className="text-sm">
                            {feature}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Energy Class */}
                  <div>
                    <Label>Energiklass</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {energyClasses.map((energyClass) => (
                        <Button
                          key={energyClass}
                          variant={
                            filters.energyClass?.includes(energyClass)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              energyClass: prev.energyClass?.includes(
                                energyClass,
                              )
                                ? prev.energyClass.filter(
                                  (e) => e !== energyClass,
                                )
                                : [...(prev.energyClass || []), energyClass],
                            }))
                          }
                        >
                          {energyClass}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="flex-1">
          {/* Map View */}
          {viewMode === "map" ? (
            <div className="h-[600px] mb-8">
              <PropertyMap
                properties={properties}
                selectedLocation={selectedLocation}
              />
            </div>
          ) : (
            <div className="mb-8 h-[400px]">
              <PropertyMap
                properties={properties}
                selectedLocation={selectedLocation}
              />
            </div>
          )}

          {/* Sort Button and Filters */}
          <div className="mb-6 space-y-4">
            {/* Main Country Tabs */}
            <div className="flex items-center justify-center">
              <Tabs
                value={countryTab}
                onValueChange={(value) =>
                  setCountryTab(value as "SVERIGE" | "UTOMLANDS")
                }
                className="w-full max-w-md"
              >
                <TabsList className="w-full">
                  <TabsTrigger
                    value="SVERIGE"
                    className="text-base font-semibold"
                  >
                    Sverige
                  </TabsTrigger>
                  <TabsTrigger
                    value="UTOMLANDS"
                    className="text-base font-semibold"
                  >
                    Utland
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Property Type Filter Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Tabs
                value={activeTab}
                className="hidden md:block overflow-x-auto"
                onValueChange={(value) => onChangeSearchTab(value)}
              >
                <TabsList className="grid grid-cols-7">
                  <TabsTrigger value="ALL">
                    Alla {`(${getCount(searchData?.properties ?? [])})`}
                  </TabsTrigger>
                  <TabsTrigger value="FOR_SALE">
                    Till salu{" "}
                    {`(${getCount(searchData?.properties ?? [], "FOR_SALE", "status")})`}
                  </TabsTrigger>
                  <TabsTrigger value="COMING_SOON">
                    Snart till salu{" "}
                    {`(${getCount(searchData?.properties ?? [], "COMING_SOON", "status")})`}
                  </TabsTrigger>
                  <TabsTrigger value="SOLD">
                    Slutpriser{" "}
                    {`(${getCount(searchData?.properties ?? [], "SOLD", "status")})`}
                  </TabsTrigger>
                  <TabsTrigger value="FOR_RENT">
                    Uthyrning{" "}
                    {`(${getCount(searchData?.properties ?? [], "FOR_RENT", "status")})`}
                  </TabsTrigger>
                  <TabsTrigger value="NYPRODUKTION">
                    Nyproduktion{" "}
                    {`(${getCount(searchData?.properties ?? [], "NYPRODUKTION", "status")})`}
                  </TabsTrigger>
                  <TabsTrigger value="COMMERCIAL">
                    Kommersiellt{" "}
                    {`(${getCount(searchData?.properties ?? [], "COMMERCIAL", "status")})`}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="sm:hidden w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-muted hover:bg-muted/80 border-0"
                    >
                      <span className="flex items-center gap-2">
                        {searchPropertyTabs.find(
                          (item) => item.value === activeSearchTab,
                        )?.label || "Alla"}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[var(--radix-dropdown-menu-trigger-width)]"
                    align="start"
                  >
                    {searchPropertyTabs.map((item) => {
                      const isActive = activeSearchTab === item.value;
                      return (
                        <DropdownMenuItem key={item.value} asChild>
                          <button
                            type="button"
                            className={cn(
                              "flex items-center gap-2 cursor-pointer",
                              isActive && "bg-accent font-medium",
                            )}
                            onClick={() => onChangeSearchTab(item.value)}
                          >
                            {item.label}
                          </button>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Sortera efter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          sortBy: option.value,
                        }))
                      }
                      className={
                        filters.sortBy === option.value ? "bg-accent" : ""
                      }
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Grid/List View */}
          {viewMode !== "map" &&
            (properties.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Inga fastigheter hittades
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Prova att justera dina sökkriterier för att hitta fler
                    fastigheter.
                  </p>
                  <Button onClick={clearFilters}>Rensa filter</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
