import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import type { T_Property_Search_Input } from "@/trpc/routes/property-search";
import { getFiltersFromParams, updateFilterParam } from "../utils/url-params";

type InputValues = {
  basicSearch: string;
  aiSearch: string;
  location: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  minArea: number;
  maxArea: number;
  minRooms: number;
  maxRooms: number;
  energyClass: string[];
};

const getInitialInputValues = (filters: T_Property_Search_Input): InputValues => ({
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
  energyClass: filters.energyClass || [],
});

export const usePropertySearchFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<T_Property_Search_Input>(
    getFiltersFromParams(searchParams),
  );

  const [inputValues, setInputValues] = useState<InputValues>(
    getInitialInputValues(getFiltersFromParams(searchParams)),
  );

  const updateUrlParams = (params: URLSearchParams) => {
    const queryString = params.toString();
    router.replace(
      queryString ? `${pathname}?${queryString}` : pathname,
      {
        scroll: false,
      },
    );
  };

  const handleSearch = (value: string, type: "basic" | "ai") => {
    setFilters((prev) => ({
      ...prev,
      query: value,
    }));

    const params = new URLSearchParams(searchParams.toString());
    updateFilterParam(params, "query", value);

    if (type === "ai" && value.trim()) {
      setInputValues((prev) => ({ ...prev, basicSearch: "" }));
      params.set("ai", "true");
    } else {
      setInputValues((prev) => ({ ...prev, aiSearch: "" }));
      params.delete("ai");
    }

    updateUrlParams(params);
  };

  const debounceBasicSearch = useDebounce((value: string) => {
    handleSearch(value, "basic");
  }, 1000);

  const handleBasicSearch = (value: string) => {
    setInputValues((prev) => ({ ...prev, basicSearch: value }));
    debounceBasicSearch(value);
  };

  const debounceLocationSearch = useDebounce((value: string) => {
    setFilters((prev) => ({
      ...prev,
      location: value,
    }));

    const params = new URLSearchParams(searchParams.toString());
    updateFilterParam(params, "location", value);
    updateUrlParams(params);
  }, 1000);

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

    const params = new URLSearchParams(searchParams.toString());
    updateFilterParam(params, "propertyType", newValue);
    updateUrlParams(params);
  };

  const debouncePriceRangeSearch = useDebounce(
    (value: string, type: "min" | "max") => {
      setFilters((prev) => ({
        ...prev,
        [type === "min" ? "minPrice" : "maxPrice"]: value
          ? Number(value)
          : undefined,
      }));

      const params = new URLSearchParams(searchParams.toString());
      updateFilterParam(
        params,
        type === "min" ? "minPrice" : "maxPrice",
        value,
      );
      updateUrlParams(params);
    },
    1000,
  );

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

    const params = new URLSearchParams(searchParams.toString());
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

    updateUrlParams(params);
  };

  const handleRoomsRange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      minRooms: min,
      maxRooms: max,
    }));

    const params = new URLSearchParams(searchParams.toString());
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

    updateUrlParams(params);
  };

  const handleEnergyClass = (energyClass: string) => {
    setInputValues((prev) => {
      const currentSelection = prev.energyClass || [];
      const newSelection = currentSelection.includes(energyClass)
        ? currentSelection.filter((e) => e !== energyClass)
        : [...currentSelection, energyClass];

      setFilters((prevFilters) => {
        const params = new URLSearchParams(searchParams.toString());
        updateFilterParam(params, "energyClass", newSelection);
        updateUrlParams(params);

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

  const handleFeatures = (feature: string) => {
    setFilters((prev) => {
      const newFeatures = prev.features?.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...(prev.features || []), feature];

      const params = new URLSearchParams(searchParams.toString());
      updateFilterParam(params, "features", newFeatures);
      updateUrlParams(params);

      return {
        ...prev,
        features: newFeatures,
      };
    });
  };

  const handleSortBy = (sortBy: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
    }));

    const params = new URLSearchParams(searchParams.toString());
    updateFilterParam(params, "sortBy", sortBy);
    updateUrlParams(params);
  };

  const handleListingType = (listingType: string) => {
    setFilters((prev) => ({
      ...prev,
      listingType,
    }));

    const params = new URLSearchParams(searchParams.toString());
    updateFilterParam(params, "listingType", listingType);
    updateUrlParams(params);
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
      energyClass: [],
    });

    router.replace(pathname, {
      scroll: false,
    });
  };

  const clearFilters = () => {
    const clearedFilters = getFiltersFromParams(new URLSearchParams());
    setFilters(clearedFilters);
    clearInputValues();
  };

  return {
    filters,
    inputValues,
    setInputValues,
    setFilters,
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
  };
};

