"use client";

import {
  AdvancedMarker,
  APIProvider,
  Map as GoogleMap,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import type { Property } from "db";
import { AlertCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { env } from "@/env";

interface PropertyMapProps {
  selectedLocation?: {
    center_lat?: number;
    center_lng?: number;
    name?: string;
    type?: string;
  };
  properties?: Property[];
  onPropertyClick?: (propertyId: string) => void;
}

const SWEDEN_CENTER = { lat: 62.0, lng: 15.0 };
const GOOGLE_MAPS_API_KEY = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const hasValidApiKey = () => {
  return (
    GOOGLE_MAPS_API_KEY &&
    typeof GOOGLE_MAPS_API_KEY === "string" &&
    GOOGLE_MAPS_API_KEY.trim().length > 0
  );
};

const getMarkerColor = (status: string) => {
  switch (status) {
    case "FOR_SALE":
      return "#3b82f6";
    case "FOR_RENT":
      return "#10b981";
    case "COMING_SOON":
      return "#f59e0b";
    case "SOLD":
      return "#ef4444";
    case "COMMERCIAL":
      return "#8b5cf6";
    default:
      return "#6b7280";
  }
};

export default function PropertyMap({
  selectedLocation,
  properties = [],
  onPropertyClick,
}: PropertyMapProps) {
  const router = useRouter();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  // Determine map center
  const mapCenter =
    selectedLocation?.center_lat && selectedLocation?.center_lng
      ? {
          lat: Number(selectedLocation.center_lat),
          lng: Number(selectedLocation.center_lng),
        }
      : properties.length > 0 &&
          properties[0].latitude &&
          properties[0].longitude
        ? {
            lat: Number(properties[0].latitude),
            lng: Number(properties[0].longitude),
          }
        : SWEDEN_CENTER;

  const handlePropertyClick = (property: Property) => {
    if (onPropertyClick) {
      onPropertyClick(property.id);
    } else {
      router.push(`/annons/${property.id}`);
    }
  };

  if (!hasValidApiKey()) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center p-8">
          <AlertCircleIcon className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h3 className="text-base @lg:text-lg text-center font-semibold mb-2">
            Google Maps API-nyckel saknas eller är ogiltig
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Kontakta administratören för att konfigurera Google Maps
            API-nyckeln.
            <br />
            Se till att API-nyckeln är korrekt och att Maps JavaScript API är
            aktiverat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="w-full h-full relative">
        <GoogleMap
          defaultCenter={mapCenter}
          defaultZoom={selectedLocation ? 12 : 6}
          mapId="property-map"
          style={{ width: "100%", height: "100%" }}
        >
          {properties
            .filter(
              (p) =>
                p.latitude !== null &&
                p.latitude !== undefined &&
                p.longitude !== null &&
                p.longitude !== undefined,
            )
            .map((property) => (
              <AdvancedMarker
                key={property.id}
                position={{
                  lat: Number(property.latitude),
                  lng: Number(property.longitude),
                }}
                onClick={() => {
                  setSelectedProperty(property);
                  handlePropertyClick(property);
                }}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer"
                  style={{
                    backgroundColor: getMarkerColor(property.status),
                  }}
                />
              </AdvancedMarker>
            ))}

          {selectedProperty?.latitude && selectedProperty.longitude && (
            <InfoWindow
              position={{
                lat: Number(selectedProperty.latitude),
                lng: Number(selectedProperty.longitude),
              }}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-sm mb-1">
                  {selectedProperty.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {selectedProperty.addressStreet},{" "}
                  {selectedProperty.addressCity}
                </p>
                <p className="text-sm font-bold text-primary">
                  {selectedProperty.price.toLocaleString("sv-SE")} kr
                </p>
                <Badge className="mt-2" variant="outline">
                  {selectedProperty.status}
                </Badge>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </APIProvider>
  );
}
