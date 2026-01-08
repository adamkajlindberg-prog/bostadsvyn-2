import type { T_Property_Search_Input } from "@/trpc/routes/property-search";

/**
 * Parses URL search parameters into a filter object
 */
export const getFiltersFromParams = (
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

/**
 * Updates a URLSearchParams object with a filter value
 */
export const updateFilterParam = (
  params: URLSearchParams,
  key: string,
  value: string | number | undefined | string[],
): void => {
  if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
    params.delete(key);
  } else if (Array.isArray(value)) {
    params.delete(key);
    value.forEach((v) => params.append(key, v));
  } else {
    params.set(key, String(value));
  }
};

