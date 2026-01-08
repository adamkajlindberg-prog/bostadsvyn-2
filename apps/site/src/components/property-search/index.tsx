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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
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
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import type { T_Property_Search_Input } from "@/trpc/routes/property-search";
import {
  commonFeatures,
  energyClasses,
  propertyTypeLabels,
  searchPropertyTabs,
  sortOptions,
} from "@/utils/constants";
import { getCount } from "@/utils/objects";

type ViewMode = "grid" | "map";

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
    energyClass: params.get("energyClass")?.split(",").filter(Boolean) || [],
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
    ai: params.get("ai") === "true" ? true : undefined,
  };
};

export default function PropertySearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

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
  const [activeSearchTab, setActiveSearchTab] = useState("");

  // Hide filter checkboxes
  const [hideRental, setHideRental] = useState(false);
  const [hideCommercial, setHideCommercial] = useState(false);
  const [hideNyproduktion, setHideNyproduktion] = useState(false);

  // Separated filter states
  const [inputValues, setInputValues] = useState({
    basicSearch: !filters.ai ? filters.query || "" : "",
    aiSearch: filters.ai ? filters.query || "" : "",
    location: filters.location || "",
    propertyType: filters.propertyType || "",
    minPrice: filters.minPrice?.toString() || "",
    maxPrice: filters.maxPrice?.toString() || "",
    minArea: filters.minArea || 0,
    maxArea: filters.maxArea || 1000,
    minRooms: filters.minRooms || 0,
    maxRooms: filters.maxRooms || 10,
    energyClass: filters.energyClass || []
  });

  const updateUrlParams = () => {
    const queryString = params.toString();
    router.replace(
      queryString ? `${pathname}?${queryString}` : pathname,
      {
        scroll: false,
      },
    );
  };

  const debounceBasicSearch = useDebounce((value: string) => {
    handleSearch(value, "basic");
  }, 1000);

  const debounceLocationSearch = useDebounce((value: string) => {
    setFilters((prev) => ({
      ...prev,
      location: value,
    }));

    if (value.trim()) {
      params.set("location", value);
    } else {
      params.delete("location");
    }

    updateUrlParams();
  }, 1000);

  const debouncePriceRangeSearch = useDebounce(
    (value: string, type: "min" | "max") => {
      setFilters((prev) => ({
        ...prev,
        [type === "min" ? "minPrice" : "maxPrice"]: value
          ? Number(value)
          : undefined,
      }));

      if (value.trim()) {
        params.set(type === "min" ? "minPrice" : "maxPrice", value);
      } else {
        params.delete(type === "min" ? "minPrice" : "maxPrice");
      }

      updateUrlParams();
    },
    1000,
  );

  const handleSearch = (value: string, type: "basic" | "ai") => {
    setFilters((prev) => ({
      ...prev,
      query: value,
    }));

    if (value.trim()) {
      params.set("query", value);
    } else {
      params.delete("query");
    }

    if (type === "ai") {
      setInputValues((prev) => ({ ...prev, basicSearch: "" }));
      params.set("ai", "true");
    } else {
      setInputValues((prev) => ({ ...prev, aiSearch: "" }));
      params.delete("ai");
    }

    updateUrlParams();
  };

  const handleBasicSearch = (value: string) => {
    setInputValues((prev) => ({ ...prev, basicSearch: value }));
    debounceBasicSearch(value);
  };

  const handleLocationSearch = (value: string) => {
    setInputValues((prev) => ({ ...prev, location: value }));
    debounceLocationSearch(value);
  };

  const handlePropertyType = (value: string) => {
    const isCurrentlySelected = filters.propertyType === value;
    const newValue = isCurrentlySelected ? "" : value;

    setFilters((prev) => ({
      ...prev,
      propertyType: newValue,
    }));

    if (newValue.trim()) {
      params.set("propertyType", newValue);
    } else {
      params.delete("propertyType");
    }

    updateUrlParams();
  };

  const handlePriceRange = (value: string, type: "min" | "max") => {
    setInputValues((prev) => ({
      ...prev,
      [type === "min" ? "minPrice" : "maxPrice"]: value,
    }));
    debouncePriceRangeSearch(value, type);
  };

  const handleAreaRange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      minArea: min,
      maxArea: max,
    }));

    if (min > 0) {
      params.set("minArea", min.toString());
    } else {
      params.delete("minArea");
    }
    if (max < 1000) {
      params.set("maxArea", max.toString());
    } else {
      params.delete("maxArea");
    }

    updateUrlParams();
  }

  const handleRoomsRange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      minRooms: min,
      maxRooms: max,
    }));

    if (min > 0) {
      params.set("minRooms", min.toString());
    } else {
      params.delete("minRooms");
    }
    if (max < 10) {
      params.set("maxRooms", max.toString());
    } else {
      params.delete("maxRooms");
    }

    updateUrlParams();
  }

  const handleEnergyClass = (energyClass: string) => {
    setInputValues((prev) => {
      const currentSelection = prev.energyClass || [];
      const newSelection = currentSelection.includes(energyClass)
        ? currentSelection.filter((e) => e !== energyClass)
        : [...currentSelection, energyClass];

      setFilters((prevFilters) => {
        if (newSelection.length > 0) {
          params.set("energyClass", newSelection.join(","));
        } else {
          params.delete("energyClass");
        }

        updateUrlParams();

        return {
          ...prevFilters,
          energyClass: newSelection,
        };
      });

      return {
        ...prev,
        energyClass: newSelection,
      };
    });
  };

  const clearInputValues = () => {
    setInputValues({
      basicSearch: "",
      aiSearch: "",
      location: "",
      propertyType: "",
      minPrice: "",
      maxPrice: "",
      minArea: 0,
      maxArea: 1000,
      minRooms: 0,
      maxRooms: 10,
      energyClass: []
    });

    router.replace(pathname, {
      scroll: false,
    });
  };

  const clearFilters = () => {
    const clearedFilters = getFiltersFromParams(new URLSearchParams());
    setFilters(clearedFilters);
    clearInputValues();
    setSelectedLocation(undefined);
    setHideRental(false);
    setHideCommercial(false);
    setHideNyproduktion(false);
  };

  const trpc = useTRPC();

  const {
    data: searchData,
    isLoading: isLoadingSearchData,
    isFetching: isFetchingSearchData,
  } = useQuery(trpc.propertySearch.search.queryOptions(filters));

  const allProperties: Property[] = searchData?.properties ?? [];

  // Filter properties based on hide checkboxes
  const properties: Property[] = allProperties.filter((property) => {
    if (hideRental && property.status === "FOR_RENT") return false;
    if (hideCommercial && property.status === "COMMERCIAL") return false;
    if (hideNyproduktion && property.status === "NYPRODUKTION") return false;
    return true;
  });

  const totalResults = properties.length;

  // Group properties by days since creation
  const groupPropertiesByDays = (propertiesToGroup: Property[]) => {
    const groups: {
      [key: string]: Property[];
    } = {};
    const now = new Date();

    propertiesToGroup.forEach((property) => {
      if (!property.createdAt) return;

      const createdDate = new Date(property.createdAt);
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let groupKey: string;
      if (diffDays === 0) {
        groupKey = "Idag";
      } else if (diffDays === 1) {
        groupKey = "Igår";
      } else if (diffDays >= 2 && diffDays <= 7) {
        groupKey = `${diffDays} dagar`;
      } else if (diffDays > 7 && diffDays <= 28) {
        const weeks = Math.floor(diffDays / 7);
        groupKey = `${weeks} ${weeks === 1 ? "vecka" : "veckor"}`;
      } else {
        const weeks = Math.floor(diffDays / 7);
        groupKey = `${weeks} veckor`;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(property);
    });

    // Sort groups by time (newest first)
    const sortedGroups: {
      label: string;
      properties: Property[];
    }[] = [];

    // Add "Idag" first
    if (groups["Idag"]) {
      sortedGroups.push({
        label: "Idag",
        properties: groups["Idag"],
      });
    }

    // Add "Igår" second
    if (groups["Igår"]) {
      sortedGroups.push({
        label: "Igår",
        properties: groups["Igår"],
      });
    }

    // Add day groups (2-7 days)
    for (let i = 2; i <= 7; i++) {
      const key = `${i} dagar`;
      if (groups[key]) {
        sortedGroups.push({
          label: key,
          properties: groups[key],
        });
      }
    }

    // Add week groups
    const weekKeys = Object.keys(groups).filter(
      (k) => k.includes("vecka") || k.includes("veckor"),
    );
    weekKeys
      .sort((a, b) => {
        const aNum = parseInt(a);
        const bNum = parseInt(b);
        return aNum - bNum;
      })
      .forEach((key) => {
        sortedGroups.push({
          label: key,
          properties: groups[key],
        });
      });

    return sortedGroups;
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
            {isLoadingSearchData || isFetchingSearchData
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
                  Beskriv din drömbostad i naturligt språk. Vår AI tolkar
                  automatiskt dina önskemål.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="T.ex. '3 rum lägenhet i Stockholm'"
                    value={inputValues.aiSearch}
                    onChange={(e) =>
                      setInputValues((prev) => ({
                        ...prev,
                        aiSearch: e.target.value,
                      }))
                    }
                    className="text-sm py-[19px] bg-background shadow-none"
                  />
                  <Button
                    onClick={() => handleSearch(inputValues.aiSearch, "ai")}
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Basic Search */}
              <div>
                <Label>Söka</Label>
                <Input
                  value={inputValues.basicSearch}
                  onChange={(e) => handleBasicSearch(e.target.value)}
                  placeholder="T.ex. Villa i Stockholm"
                  className="mt-3 py-[19px]"
                />
              </div>

              <Separator />

              {/* Location Search */}
              <div>
                <Label>Sök plats</Label>
                <Input
                  placeholder="T.ex. Stockholm"
                  value={inputValues.location}
                  onChange={(e) => handleLocationSearch(e.target.value)}
                  className="mt-3 py-[19px]"
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
                        checked={filters.propertyType === type.toLowerCase()}
                        onCheckedChange={() =>
                          handlePropertyType(type.toLowerCase())
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
                      value={inputValues.minPrice}
                      onChange={(e) =>
                        handlePriceRange(e.target.value, "min")
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Till"
                      value={inputValues.maxPrice}
                      onChange={(e) =>
                        handlePriceRange(e.target.value, "max")
                      }
                    />
                  </div>
                </div>
              )}

              {/* Area Range */}
              <div>
                <Label>Boarea (m²)</Label>
                <div className="mt-4 space-y-4">
                  <Slider
                    value={[inputValues.minArea, inputValues.maxArea]}
                    onValueChange={([min, max]) => {
                      setInputValues((prev) => ({
                        ...prev,
                        minArea: min,
                        maxArea: max
                      }))
                    }}
                    onValueCommit={([min, max]) =>
                      handleAreaRange(min, max)
                    }
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{inputValues.minArea} m²</span>
                    <span>{inputValues.maxArea} m²</span>
                  </div>
                </div>
              </div>

              {/* Rooms */}
              <div>
                <Label>Antal rum</Label>
                <div className="mt-4 space-y-4">
                  <Slider
                    value={[inputValues.minRooms, inputValues.maxRooms]}
                    onValueChange={([min, max]) => {
                      setInputValues((prev) => ({
                        ...prev,
                        minRooms: min,
                        maxRooms: max
                      }))
                    }}
                    onValueCommit={([min, max]) => {
                      handleRoomsRange(min, max);
                    }}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{inputValues.minRooms} rum</span>
                    <span>{inputValues.maxRooms}+ rum</span>
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
                            inputValues.energyClass?.includes(energyClass)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleEnergyClass(energyClass)}
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

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hideRental"
                    checked={hideRental}
                    onCheckedChange={(checked) =>
                      setHideRental(checked === true)
                    }
                  />
                  <Label
                    htmlFor="hideRental"
                    className="text-sm cursor-pointer"
                  >
                    Visa ej hyresbostäder
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hideCommercial"
                    checked={hideCommercial}
                    onCheckedChange={(checked) =>
                      setHideCommercial(checked === true)
                    }
                  />
                  <Label
                    htmlFor="hideCommercial"
                    className="text-sm cursor-pointer"
                  >
                    Visa ej kommersiellt
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hideNyproduktion"
                    checked={hideNyproduktion}
                    onCheckedChange={(checked) =>
                      setHideNyproduktion(checked === true)
                    }
                  />
                  <Label
                    htmlFor="hideNyproduktion"
                    className="text-sm cursor-pointer"
                  >
                    Visa ej nyproduktion
                  </Label>
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
              <div className="mx-auto space-y-8">
                {groupPropertiesByDays(properties).map((group) => (
                  <div key={group.label} className="space-y-4">
                    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 border-b">
                      <h3 className="text-lg font-semibold text-foreground">
                        {group.label}
                      </h3>
                    </div>
                    <div className="space-y-6">
                      {group.properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
