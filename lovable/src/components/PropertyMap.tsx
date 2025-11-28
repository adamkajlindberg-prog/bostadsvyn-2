import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertCircle, Bed, Bath, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMap } from '@vis.gl/react-google-maps';

interface Property {
  id: string;
  title: string;
  price: number;
  status: string;
  address_street: string;
  address_city: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  living_area?: number;
  property_type?: string;
  tenure_type?: string;
  plot_area?: number;
  floor_number?: number;
  monthly_fee?: number;
  year_built?: number;
}

interface PropertyMapProps {
  searchLocation?: string;
  selectedLocation?: {
    center_lat?: number;
    center_lng?: number;
    name?: string;
    type?: string;
  };
  properties?: Property[];
  onPropertyClick?: (propertyId: string) => void;
}

// Default center: Middle of Sweden
const DEFAULT_CENTER = { lat: 62.0, lng: 15.0 };
const SWEDEN_CENTER = { lat: 62.0, lng: 15.0 };
const GOOGLE_MAPS_API_KEY = 'AIzaSyBnetE0gWPmS8Wxrzi_U3KOiXOBRz3MJKc';

// Marker colors based on property status
const getMarkerColor = (status: string) => {
  switch (status) {
    case 'FOR_SALE':
      return '#3b82f6'; // blue - Till salu
    case 'FOR_RENT':
      return '#10b981'; // emerald/green - Uthyrning
    case 'COMING_SOON':
      return '#f59e0b'; // amber - Snart till salu
    case 'SOLD':
      return '#ef4444'; // red - Slutpriser
    case 'COMMERCIAL':
      return '#8b5cf6'; // purple - Kommersiellt
    default:
      return '#6b7280'; // gray
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'FOR_SALE':
      return 'Till salu';
    case 'FOR_RENT':
      return 'Uthyrning';
    case 'COMING_SOON':
      return 'Snart till salu';
    case 'SOLD':
      return 'Slutpris';
    case 'COMMERCIAL':
      return 'Kommersiellt';
    default:
      return status;
  }
};

const propertyTypeLabels: Record<string, string> = {
  'APARTMENT': 'Lägenhet',
  'HOUSE': 'Villa',
  'COTTAGE': 'Fritidshus',
  'PLOT': 'Tomt',
  'COMMERCIAL': 'Kommersiellt',
  'CONDOMINIUM': 'Bostadsrätt',
  'COOPERATIVE': 'Andelslägenhet',
  'TOWNHOUSE': 'Radhus',
  'FARM': 'Gård',
};

const tenureTypeLabels: Record<string, string> = {
  'CONDOMINIUM': 'Bostadsrätt',
  'OWNERSHIP': 'Äganderätt',
  'RENTAL': 'Hyresrätt',
  'COOPERATIVE': 'Andelsrätt',
};

// Component to handle boundary overlay
const BoundaryOverlay: React.FC<{ selectedLocation?: any }> = ({ selectedLocation }) => {
  const map = useMap();
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!map || !selectedLocation?.name) {
      // Remove existing polygon if no location selected
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
        polygonRef.current = null;
      }
      return;
    }

    const fetchBoundary = async () => {
      try {
        // Use Nominatim to get boundary data for Swedish locations
        const query = encodeURIComponent(selectedLocation.name + ', Sweden');
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${query}&format=json&polygon_geojson=1&addressdetails=1&limit=1`
        );
        const data = await response.json();

        if (data && data.length > 0 && data[0].geojson) {
          const geojson = data[0].geojson;
          
          // Remove old polygon
          if (polygonRef.current) {
            polygonRef.current.setMap(null);
          }

          // Convert GeoJSON to Google Maps Polygon coordinates
          let paths: google.maps.LatLngLiteral[] = [];
          
          if (geojson.type === 'Polygon') {
            paths = geojson.coordinates[0].map((coord: number[]) => ({
              lat: coord[1],
              lng: coord[0]
            }));
          } else if (geojson.type === 'MultiPolygon') {
            // For MultiPolygon, use the largest polygon
            let largestPolygon = geojson.coordinates[0][0];
            let maxLength = largestPolygon.length;
            
            geojson.coordinates.forEach((polygon: number[][][]) => {
              if (polygon[0].length > maxLength) {
                largestPolygon = polygon[0];
                maxLength = polygon[0].length;
              }
            });
            
            paths = largestPolygon.map((coord: number[]) => ({
              lat: coord[1],
              lng: coord[0]
            }));
          }

          if (paths.length > 0) {
            // Create polygon overlay
            polygonRef.current = new google.maps.Polygon({
              paths: paths,
              strokeColor: '#2563eb',
              strokeOpacity: 0.8,
              strokeWeight: 3,
              fillColor: '#1e40af',
              fillOpacity: 0.15,
              map: map
            });
          }
        }
      } catch (error) {
        console.error('Error fetching boundary data:', error);
      }
    };

    fetchBoundary();

    return () => {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
        polygonRef.current = null;
      }
    };
  }, [map, selectedLocation]);

  return null;
};

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  searchLocation, 
  selectedLocation,
  properties = [],
  onPropertyClick 
}) => {
  const navigate = useNavigate();
  const [center, setCenter] = useState(SWEDEN_CENTER);
  const [zoom, setZoom] = useState(5);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);

  useEffect(() => {
    // If no search location provided (empty search), always show all of Sweden
    if (!searchLocation || searchLocation.trim() === '') {
      setCenter(SWEDEN_CENTER);
      setZoom(5);
      return;
    }

    if (selectedLocation?.center_lat && selectedLocation?.center_lng) {
      // Use selected location from search
      setCenter({
        lat: selectedLocation.center_lat,
        lng: selectedLocation.center_lng
      });
      setZoom(13);
    } else if (properties.length > 0) {
      // Calculate bounds for all properties with coordinates
      const propertiesWithCoords = properties.filter(p => p.latitude && p.longitude);
      if (propertiesWithCoords.length > 0) {
        const avgLat = propertiesWithCoords.reduce((sum, p) => sum + (p.latitude || 0), 0) / propertiesWithCoords.length;
        const avgLng = propertiesWithCoords.reduce((sum, p) => sum + (p.longitude || 0), 0) / propertiesWithCoords.length;
        setCenter({ lat: avgLat, lng: avgLng });
        setZoom(11);
      }
    } else {
      // Default to center of Sweden when no search or properties
      setCenter(SWEDEN_CENTER);
      setZoom(5);
    }
  }, [searchLocation, selectedLocation, properties]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Card className="w-full h-full">
        <CardContent className="flex items-center justify-center h-full p-12">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h3 className="text-lg font-semibold mb-2">Google Maps API-nyckel saknas</h3>
            <p className="text-muted-foreground text-sm">
              Kontakta administratören för att konfigurera Google Maps.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full overflow-hidden">
      <CardContent className="p-0 h-full">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            key={`${center.lat}-${center.lng}-${zoom}`}
            mapId="bostadsvyn-map"
            defaultCenter={center}
            defaultZoom={zoom}
            gestureHandling="greedy"
            disableDefaultUI={false}
            zoomControl={true}
            mapTypeControl={true}
            streetViewControl={true}
            fullscreenControl={true}
            style={{ width: '100%', height: '100%' }}
            onClick={() => setSelectedProperty(null)}
          >
            <BoundaryOverlay selectedLocation={selectedLocation} />
            
            {properties.map((property) => {
              if (!property.latitude || !property.longitude) return null;
              
              const markerColor = getMarkerColor(property.status);
              const isHovered = hoveredProperty === property.id;
              
              return (
                <AdvancedMarker
                  key={property.id}
                  position={{ lat: property.latitude, lng: property.longitude }}
                  onClick={() => {
                    // Toggle: stäng om samma marker klickas igen
                    if (selectedProperty?.id === property.id) {
                      setSelectedProperty(null);
                    } else {
                      setSelectedProperty(property);
                    }
                  }}
                >
                  <div 
                    className="rounded-full w-4 h-4 flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer border border-white"
                    style={{ backgroundColor: markerColor }}
                    onMouseEnter={() => setHoveredProperty(property.id)}
                    onMouseLeave={() => setHoveredProperty(null)}
                  >
                    <MapPin className="h-2.5 w-2.5 text-white" />
                  </div>
                </AdvancedMarker>
              );
            })}

            {selectedProperty && selectedProperty.latitude && selectedProperty.longitude && (
              <InfoWindow
                position={{ lat: selectedProperty.latitude, lng: selectedProperty.longitude }}
                onCloseClick={() => setSelectedProperty(null)}
              >
                <div className="flex w-[450px] h-[280px] overflow-hidden rounded-lg -mt-2">
                  {/* Image section - square */}
                  {selectedProperty.images?.[0] && (
                    <div 
                      className="w-[280px] h-[280px] cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
                      onClick={() => navigate(`/annons/${selectedProperty.id}`)}
                    >
                      <img 
                        src={selectedProperty.images[0]} 
                        alt={selectedProperty.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/api/placeholder/400/300';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Information section - compact */}
                  <div className="flex-1 p-3 flex flex-col bg-white">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <Badge 
                          variant="outline" 
                          className="text-[10px] px-2 py-0.5"
                          style={{ 
                            backgroundColor: getMarkerColor(selectedProperty.status) + '20',
                            borderColor: getMarkerColor(selectedProperty.status),
                            color: getMarkerColor(selectedProperty.status)
                          }}
                        >
                          {getStatusLabel(selectedProperty.status)}
                        </Badge>
                        {selectedProperty.property_type && (
                          <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                            {propertyTypeLabels[selectedProperty.property_type] || selectedProperty.property_type}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2">{selectedProperty.title}</h3>
                      
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        {selectedProperty.address_street}, {selectedProperty.address_city}
                      </p>
                      
                      <p className="font-bold text-lg" style={{ color: getMarkerColor(selectedProperty.status) }}>
                        {selectedProperty.status === 'FOR_RENT' 
                          ? `${selectedProperty.price.toLocaleString('sv-SE')} kr/mån`
                          : `${selectedProperty.price.toLocaleString('sv-SE')} kr`
                        }
                      </p>
                    </div>
                    
                    {/* Property details grid */}
                    <div className="mt-3 pt-3 border-t space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        {selectedProperty.living_area && (
                          <div className="flex items-center gap-1">
                            <Square className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{selectedProperty.living_area} m²</span>
                          </div>
                        )}
                        {selectedProperty.rooms && (
                          <div className="flex items-center gap-1">
                            <Bed className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{selectedProperty.rooms} rum</span>
                          </div>
                        )}
                        {selectedProperty.bedrooms && (
                          <div className="flex items-center gap-1">
                            <Bed className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{selectedProperty.bedrooms} sovrum</span>
                          </div>
                        )}
                        {selectedProperty.bathrooms && (
                          <div className="flex items-center gap-1">
                            <Bath className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{selectedProperty.bathrooms} badrum</span>
                          </div>
                        )}
                      </div>
                      
                      {(selectedProperty.tenure_type || selectedProperty.monthly_fee || selectedProperty.year_built) && (
                        <div className="grid grid-cols-1 gap-1 text-[10px] pt-1">
                          {selectedProperty.tenure_type && (
                            <div className="text-muted-foreground">
                              <span className="font-medium">{tenureTypeLabels[selectedProperty.tenure_type] || selectedProperty.tenure_type}</span>
                            </div>
                          )}
                          {selectedProperty.monthly_fee && (
                            <div className="text-muted-foreground">
                              Avgift: <span className="font-medium">{selectedProperty.monthly_fee.toLocaleString('sv-SE')} kr/mån</span>
                            </div>
                          )}
                          {selectedProperty.year_built && (
                            <div className="text-muted-foreground">
                              Byggår: <span className="font-medium">{selectedProperty.year_built}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </CardContent>
    </Card>
  );
};

export default PropertyMap;
