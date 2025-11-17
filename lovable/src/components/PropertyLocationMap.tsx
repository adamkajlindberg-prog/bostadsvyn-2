import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { AlertCircle, MapPin } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertyMapProps {
  address: string;
  city: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  address,
  city,
  postalCode,
  latitude: propLat,
  longitude: propLng,
}) => {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Google Maps API key
  const GOOGLE_MAPS_API_KEY = "AIzaSyBnetE0gWPmS8Wxrzi_U3KOiXOBRz3MJKc";

  useEffect(() => {
    const loadCoordinates = async () => {
      try {
        // If coordinates are already provided, use them
        if (propLat && propLng) {
          setCoordinates({ lat: propLat, lng: propLng });
          setLoading(false);
          return;
        }

        // Otherwise, geocode the address
        const fullAddress = `${address}, ${postalCode} ${city}, Sverige`;
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${GOOGLE_MAPS_API_KEY}`;

        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setCoordinates({ lat: location.lat, lng: location.lng });
        } else {
          setError("Kunde inte hitta adressen på kartan");
        }
      } catch (err) {
        console.error("Error geocoding address:", err);
        setError("Kunde inte ladda kartan");
      } finally {
        setLoading(false);
      }
    };

    loadCoordinates();
  }, [address, city, postalCode, propLat, propLng]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Område
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted animate-pulse rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Laddar karta...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !coordinates) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Område
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || "Kunde inte visa kartan för denna fastighet"}
            </AlertDescription>
          </Alert>
          <div className="mt-3 text-sm text-muted-foreground">
            <p className="font-medium">Adress:</p>
            <p>{address}</p>
            <p>
              {postalCode} {city}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Område
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm">
            <p className="font-medium mb-1">Adress:</p>
            <p className="text-muted-foreground">{address}</p>
            <p className="text-muted-foreground">
              {postalCode} {city}
            </p>
          </div>

          <div className="h-64 w-full rounded-lg overflow-hidden border border-border">
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
              <Map
                defaultCenter={coordinates}
                defaultZoom={15}
                gestureHandling="cooperative"
                disableDefaultUI={false}
                mapId="property-map"
              >
                <Marker position={coordinates} title={address} />
              </Map>
            </APIProvider>
          </div>

          <p className="text-xs text-muted-foreground">
            Markören visar den ungefärliga platsen för fastigheten
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyMap;
