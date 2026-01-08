"use client";

import {
  AdvancedMarker,
  APIProvider,
  Map as GoogleMap,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import type { Property } from "db";
import {
  AlertCircleIcon,
  BathIcon,
  BedDoubleIcon,
  BedIcon,
  HomeIcon,
  MapPinIcon,
  RulerIcon,
  SquareIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { env } from "@/env";
import { getPropertyImageUrl } from "@/image";
import { propertyTypeLabels } from "@/utils/constants";

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

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "FOR_RENT":
      return "Uthyrning";
    case "FOR_SALE":
      return "Till salu";
    case "COMING_SOON":
      return "Kommer snart";
    case "SOLD":
      return "Såld";
    case "RENTED":
      return "Uthyrd";
    default:
      return status;
  }
};

const getPropertyTypeLabel = (propertyType: string): string => {
  // Handle singular form for badge (remove plural)
  const label = propertyTypeLabels[propertyType] || propertyType;
  // Convert plural to singular for badge display
  if (label === "Lägenheter") return "Lägenhet";
  if (label === "Villor") return "Villa";
  if (label === "Fritidshus") return "Fritidshus";
  if (label === "Tomter") return "Tomt";
  if (label === "Kommersiellt") return "Kommersiell";
  if (label.includes("/")) {
    // Handle "Radhus/Parhus/Kedjehus" -> "Radhus"
    return label.split("/")[0];
  }
  return label;
};

const formatPrice = (price: number, status: string): string => {
  const formatted = price.toLocaleString("sv-SE");
  if (status === "FOR_RENT") {
    return `${formatted} kr/mån`;
  }
  return `${formatted} kr`;
};

export default function PropertyMap({
  selectedLocation,
  properties = [],
  onPropertyClick,
}: PropertyMapProps) {
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
              <Link
                href={`/annons/${selectedProperty.id}`}
                target="_blank"
                className="block"
              >
                <div className="flex bg-background rounded-lg overflow-hidden shadow-lg">
                  {/* Image Section */}
                  <div className="w-[260px] relative aspect-square bg-muted">
                    {selectedProperty.images &&
                      selectedProperty.images.length > 0 &&
                      selectedProperty.images[0] ? (
                      <Image
                        src={getPropertyImageUrl(selectedProperty.images[0])}
                        alt={selectedProperty.title}
                        fill
                        className="object-cover object-center"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        Ingen bild tillgänglig
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="w-[200px] p-3 flex flex-col gap-2">
                    {/* Badges */}
                    <div className="flex justify-between gap-2 mb-1">
                      <Badge variant="outline" className={`text-[10px] ${selectedProperty.status === "FOR_SALE" ? "bg-blue-50 text-blue-500 border-blue-200" : selectedProperty.status === "COMING_SOON" ? "bg-orange-50 text-orange-500 border-orange-200" : "bg-green-50 text-green-700 border-green-200"}`}>
                        {getStatusLabel(selectedProperty.status)}
                      </Badge>
                      <Badge variant="outline" className="bg-muted/80 text-[10px] text-muted-foreground">
                        {getPropertyTypeLabel(selectedProperty.propertyType)}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                      {selectedProperty.title}
                    </h3>

                    {/* Address */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPinIcon className="h-3 w-3 shrink-0" />
                      <span className="line-clamp-1">
                        {selectedProperty.addressStreet},{" "}
                        {selectedProperty.addressCity}
                      </span>
                    </div>

                    {/* Price */}
                    <p className={`font-bold text-lg ${selectedProperty.status === "COMING_SOON" ? "text-orange-500" : selectedProperty.status === "FOR_RENT" ? "text-green-700" : "text-primary"}`}>
                      {formatPrice(selectedProperty.price, selectedProperty.status)}
                    </p>

                    {/* Specifications */}
                    {/* <div className="grid grid-cols-2 gap-4 text-[10px] border-t pt-3">
                      {selectedProperty.livingArea && (
                        <div className="flex items-center gap-1.5">
                          <SquareIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {selectedProperty.livingArea} m²
                          </span>
                        </div>
                      )}
                      {selectedProperty.rooms && (
                        <div className="flex items-center gap-1.5">
                          <BedIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {selectedProperty.rooms} rum
                          </span>
                        </div>
                      )}
                      {selectedProperty.bedrooms && (
                        <div className="flex items-center gap-1.5">
                          <BedDoubleIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {selectedProperty.bedrooms} sovrum
                          </span>
                        </div>
                      )}
                      {selectedProperty.bathrooms && (
                        <div className="flex items-center gap-1.5">
                          <BathIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {selectedProperty.bathrooms} badrum
                          </span>
                        </div>
                      )}
                    </div> */}
                  </div>
                </div>
              </Link>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </APIProvider>
  );
}
