import type { Property } from "db";

// Mock property used for tier comparison examples
// Using the same base property to highlight the visual difference between packages
const baseProperty: Omit<Property, "adTier"> = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  userId: "test-user",
  title: "Exklusiv villa med havsutsikt",
  description:
    "Magnifik villa i absolut toppskick med panoramautsikt över havet. Genomgående exklusiva materialval, rymliga sällskapsytor och perfekt planlösning för familjen som värdesätter kvalitet och komfort.",
  propertyType: "HOUSE",
  status: "FOR_SALE",
  price: 18500000,
  addressStreet: "Strandvägen 42",
  addressPostalCode: "182 68",
  addressCity: "Djursholm",
  addressCountry: "SE",
  livingArea: 285,
  plotArea: 1200,
  rooms: 8,
  bedrooms: 5,
  bathrooms: 3,
  yearBuilt: 2018,
  energyClass: "A",
  monthlyFee: 8500,
  images: [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=675&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=675&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=675&fit=crop",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=675&fit=crop",
  ],
  features: ["Pool", "Garage", "Trädgård", "Havsutsikt"],
  latitude: "59.3293",
  longitude: "18.0686",
  floorPlanUrl: null,
  energyDeclarationUrl: null,
  operatingCosts: 35000,
  kitchenDescription: null,
  bathroomDescription: null,
  propertyDocuments: null,
  rentalInfo: null,
  threedTourUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const premiumExample: Property = {
  ...baseProperty,
  adTier: "premium",
};

export const plusExample: Property = {
  ...baseProperty,
  adTier: "plus",
};

export const freeExample: Property = {
  ...baseProperty,
  adTier: "free",
};
