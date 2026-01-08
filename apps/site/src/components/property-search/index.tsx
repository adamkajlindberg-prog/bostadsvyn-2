"use client";

import { useQuery } from "@tanstack/react-query";
import type { Property } from "db";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import PropertyMap from "@/components/property-map";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTRPC } from "@/trpc/client";
import { FilterSidebar } from "./filter-sidebar/filter-sidebar";
import { usePropertySearchFilters } from "./hooks/use-property-search-filters";
import { EmptyState } from "./results/empty-state";
import { PropertyList } from "./results/property-list";
import { PropertyTabs } from "./results/property-tabs";
import { ResultsHeader } from "./results/results-header";
import { groupPropertiesByDays } from "./utils/property-grouping";

type ViewMode = "grid" | "map";

type ListingType =
  | "ALL"
  | "FOR_SALE"
  | "FOR_RENT"
  | "COMING_SOON"
  | "SOLD"
  | "COMMERCIAL"
  | "NYPRODUKTION";

export default function PropertySearch() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeTab, setActiveTab] = useState<ListingType>("ALL");
  const [countryTab, setCountryTab] = useState<"SVERIGE" | "UTOMLANDS">(
    "SVERIGE",
  );
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

  const {
    filters,
    inputValues,
    setInputValues,
    handleBasicSearch,
    handleSearch,
    handleLocationSearch,
    handlePropertyType,
    handlePriceRange,
    handleAreaRange,
    handleRoomsRange,
    handleEnergyClass,
    handleFeatures,
    handleSortBy,
    handleListingType,
    clearFilters,
  } = usePropertySearchFilters();

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

  const onChangeSearchTab = (value: string) => {
    setActiveSearchTab(value);
    setActiveTab(value as ListingType);
    handleListingType(value);
  };

  const handleClearFilters = () => {
    clearFilters();
    setSelectedLocation(undefined);
    setHideRental(false);
    setHideCommercial(false);
    setHideNyproduktion(false);
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

  const propertyGroups = groupPropertiesByDays(properties);

  return (
    <div className="container mx-auto px-4 py-8">
      <ResultsHeader
        totalResults={totalResults}
        isLoading={isLoadingSearchData}
        isFetching={isFetchingSearchData}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <FilterSidebar
          filters={filters}
          inputValues={inputValues}
          setInputValues={setInputValues}
          handleBasicSearch={handleBasicSearch}
          handleSearch={handleSearch}
          handleLocationSearch={handleLocationSearch}
          handlePropertyType={handlePropertyType}
          handlePriceRange={handlePriceRange}
          handleAreaRange={handleAreaRange}
          handleRoomsRange={handleRoomsRange}
          handleEnergyClass={handleEnergyClass}
          handleFeatures={handleFeatures}
          clearFilters={handleClearFilters}
        />

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
            <PropertyTabs
              activeTab={activeTab}
              activeSearchTab={activeSearchTab}
              counts={searchData?.counts}
              sortBy={filters.sortBy}
              hideRental={hideRental}
              hideCommercial={hideCommercial}
              hideNyproduktion={hideNyproduktion}
              onTabChange={onChangeSearchTab}
              onSortChange={handleSortBy}
              onHideRentalChange={setHideRental}
              onHideCommercialChange={setHideCommercial}
              onHideNyproduktionChange={setHideNyproduktion}
            />
          </div>

          {/* Grid/List View */}
          {viewMode !== "map" &&
            (properties.length === 0 ? (
              <EmptyState onClearFilters={handleClearFilters} />
            ) : (
              <PropertyList groups={propertyGroups} />
            ))}
        </div>
      </div>
    </div>
  );
}
