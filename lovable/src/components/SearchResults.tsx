import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PropertyCard from '@/components/PropertyCard';
import PropertyMap from '@/components/PropertyMap';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Calendar, TrendingUp, Home, Building2, LayoutGrid } from 'lucide-react';

interface SearchResultsProps {
  searchLocation: string;
  selectedLocation?: {
    center_lat?: number;
    center_lng?: number;
    name: string;
    type: string;
  };
}

interface Property {
  id: string;
  title: string;
  price: number;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  property_type: string;
  rooms: number;
  living_area: number;
  images: string[];
  status: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  user_id: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  year_built?: number;
  energy_class?: string;
  monthly_fee?: number;
  features?: string[];
  plot_area?: number;
  distance_km?: number;
  ad_tier?: 'free' | 'plus' | 'premium';
}

interface SalesData {
  id: string;
  address_street: string;
  address_city: string;
  sale_price: number;
  sale_date: string;
  property_type: string;
  living_area: number;
  rooms: number;
  price_per_sqm: number;
  latitude?: number;
  longitude?: number;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ 
  searchLocation, 
  selectedLocation 
}) => {
  const [activeTab, setActiveTab] = useState('for-sale');
  const [forSaleProperties, setForSaleProperties] = useState<Property[]>([]);
  const [comingSoonProperties, setComingSoonProperties] = useState<Property[]>([]);
  const [salesHistory, setSalesHistory] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(false);
  const [columnsPerRow, setColumnsPerRow] = useState<string>('2');
  const [showingAlternatives, setShowingAlternatives] = useState(false);
  const { toast } = useToast();

  // Extract city name from search location
  const getCityFromLocation = (location: string) => {
    // Handle cases like "Stockholm", "Vasastan, Stockholm", "Drottninggatan, Stockholm"
    const parts = location.split(',').map(p => p.trim());
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
  };

  const searchCity = getCityFromLocation(searchLocation);

  useEffect(() => {
    if (searchLocation) {
      fetchSearchResults();
    }
  }, [searchLocation]);

  const fetchSearchResults = async () => {
    setLoading(true);
    setShowingAlternatives(false);
    
    try {
      // Search for properties matching the location
      const { data: exactMatches, error: exactError } = await supabase
        .from('properties')
        .select('*')
        .or(`address_city.ilike.%${searchLocation}%,address_street.ilike.%${searchLocation}%`)
        .order('ad_tier', { ascending: false })
        .order('created_at', { ascending: false });

      if (exactError) throw exactError;

      // Separate by status
      const forSale = (exactMatches || []).filter(p => p.status === 'FOR_SALE') as Property[];
      const comingSoon = (exactMatches || []).filter(p => p.status === 'COMING_SOON') as Property[];

      // Fetch sales history
      const { data: salesData, error: salesError } = await supabase
        .from('property_sales_history')
        .select('*')
        .or(`address_city.ilike.%${searchLocation}%,address_street.ilike.%${searchLocation}%`)
        .order('sale_date', { ascending: false })
        .limit(50);

      if (salesError) throw salesError;

      // If no exact matches found, fetch alternatives
      if (forSale.length === 0 && comingSoon.length === 0) {
        setShowingAlternatives(true);
        
        // Try to find similar properties in the same city or nearby areas
        const city = getCityFromLocation(searchLocation);
        const { data: alternatives, error: altError } = await supabase
          .from('properties')
          .select('*')
          .ilike('address_city', `%${city}%`)
          .in('status', ['FOR_SALE', 'COMING_SOON'])
          .order('ad_tier', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(20);

        if (altError) throw altError;

        const altForSale = (alternatives || []).filter(p => p.status === 'FOR_SALE') as Property[];
        const altComingSoon = (alternatives || []).filter(p => p.status === 'COMING_SOON') as Property[];

        setForSaleProperties(altForSale);
        setComingSoonProperties(altComingSoon);
      } else {
        setForSaleProperties(forSale);
        setComingSoonProperties(comingSoon);
      }

      setSalesHistory(salesData || []);

    } catch (error) {
      console.error('Error fetching search results:', error);
      setForSaleProperties([]);
      setComingSoonProperties([]);
      setSalesHistory([]);
      
      toast({
        title: "Fel vid sökning",
        description: "Kunde inte hämta sökresultat. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Söker fastigheter...</p>
        </div>
      </div>
    );
  }

  if (!searchLocation) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold">
            {showingAlternatives ? `Liknande bostäder nära ${searchLocation}` : `Sökresultat för ${searchLocation}`}
          </h1>
        </div>
        {showingAlternatives && (
          <div className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
            <p className="text-sm">
              <strong>Din specifika sökning gav inga resultat.</strong> Vi visar istället liknande bostäder i närområdet som kan passa dig.
            </p>
          </div>
        )}
        <p className="text-muted-foreground">
          {forSaleProperties.length + comingSoonProperties.length} aktiva annonser • {salesHistory.length} slutpriser
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="for-sale" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Till salu ({forSaleProperties.length})
          </TabsTrigger>
          <TabsTrigger value="coming-soon" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Kommer snart ({comingSoonProperties.length})
          </TabsTrigger>
          <TabsTrigger value="sold" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Slutpriser ({salesHistory.length})
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Karta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="for-sale">
          {forSaleProperties.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-4">
              {forSaleProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Inga fastigheter till salu</h3>
                <p className="text-muted-foreground">Det finns för närvarande inga fastigheter till salu i {searchLocation}.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="coming-soon">
          {comingSoonProperties.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-4">
              {comingSoonProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Inga kommande fastigheter</h3>
                <p className="text-muted-foreground">Det finns för närvarande inga kommande fastigheter i {searchLocation}.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sold">
          {salesHistory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {salesHistory.map((sale) => (
                <Card key={sale.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{sale.address_street}</CardTitle>
                        <p className="text-sm text-muted-foreground">{sale.address_city}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {sale.property_type === 'apartment' ? 'Lägenhet' : 
                         sale.property_type === 'house' ? 'Villa' : 
                         sale.property_type === 'townhouse' ? 'Radhus' : sale.property_type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(sale.sale_price)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Såld {formatDate(sale.sale_date)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>{sale.living_area} m²</span>
                        <span>{sale.rooms} rum</span>
                        <span className="font-medium">
                          {formatPrice(sale.price_per_sqm)}/m²
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Inga slutpriser</h3>
                <p className="text-muted-foreground">Det finns inga registrerade slutpriser för {searchLocation}.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardContent className="p-0">
              <div className="h-[600px] w-full">
                <PropertyMap searchLocation={searchLocation} selectedLocation={selectedLocation} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};