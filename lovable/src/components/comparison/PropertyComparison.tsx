import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus,
  X,
  Home,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Check,
  Minus,
  Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Property {
  id: string;
  title: string;
  price: number;
  living_area: number;
  rooms: number;
  bedrooms?: number;
  bathrooms?: number;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  property_type: string;
  images: string[];
  created_at: string;
  energy_class?: string;
  year_built?: number;
  features?: string[];
  monthly_fee?: number;
  plot_area?: number;
  description?: string;
}

interface ComparisonMetrics {
  pricePerSqm: number;
  marketValue: number;
  potentialAppreciation: number;
  walkScore: number;
  schoolRating: number;
  overallScore: number;
}

const PropertyComparison = () => {
  const { user } = useAuth();
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [comparisonMetrics, setComparisonMetrics] = useState<{ [key: string]: ComparisonMetrics }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProperties.length > 0) {
      calculateComparisonMetrics();
    }
  }, [selectedProperties]);

  const searchProperties = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'FOR_SALE')
        .or(`title.ilike.%${searchTerm}%,address_city.ilike.%${searchTerm}%,address_street.ilike.%${searchTerm}%`)
        .limit(10);

      if (error) throw error;

      setSearchResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Ett fel uppstod vid sökningen');
    } finally {
      setLoading(false);
    }
  };

  const addPropertyToComparison = (property: Property) => {
    if (selectedProperties.length >= 4) {
      toast.error('Du kan jämföra max 4 fastigheter åt gången');
      return;
    }

    if (selectedProperties.find(p => p.id === property.id)) {
      toast.error('Fastigheten är redan tillagd');
      return;
    }

    setSelectedProperties(prev => [...prev, property]);
    toast.success('Fastighet tillagd för jämförelse');
  };

  const removePropertyFromComparison = (propertyId: string) => {
    setSelectedProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const calculateComparisonMetrics = () => {
    const metrics: { [key: string]: ComparisonMetrics } = {};

    selectedProperties.forEach(property => {
      // Calculate price per sqm
      const pricePerSqm = property.living_area ? Math.round(property.price / property.living_area) : 0;

      // Mock calculations for demo (would use real market data in production)
      const marketValue = property.price * (0.95 + Math.random() * 0.1); // ±5% of asking price
      const potentialAppreciation = Math.random() * 15 + 2; // 2-17% potential appreciation
      const walkScore = Math.floor(Math.random() * 40) + 60; // 60-100 walk score
      const schoolRating = Math.random() * 3 + 7; // 7-10 school rating

      // Calculate overall score (weighted average)
      const priceScore = Math.max(0, Math.min(100, (80000 - pricePerSqm) / 800)); // Lower price per sqm = higher score
      const appreciationScore = (potentialAppreciation / 17) * 100;
      const overallScore = Math.round(
        (priceScore * 0.3 + appreciationScore * 0.3 + walkScore * 0.2 + (schoolRating / 10) * 100 * 0.2)
      );

      metrics[property.id] = {
        pricePerSqm,
        marketValue,
        potentialAppreciation,
        walkScore,
        schoolRating,
        overallScore
      };
    });

    setComparisonMetrics(metrics);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatPricePerSqm = (price: number): string => {
    return new Intl.NumberFormat('sv-SE', {
      maximumFractionDigits: 0
    }).format(price) + ' kr/m²';
  };

  const getBestValue = (metric: keyof ComparisonMetrics, isHigherBetter: boolean = true) => {
    if (Object.keys(comparisonMetrics).length === 0) return null;
    
    const values = Object.values(comparisonMetrics).map(m => m[metric] as number);
    return isHigherBetter ? Math.max(...values) : Math.min(...values);
  };

  const isHighlighted = (propertyId: string, metric: keyof ComparisonMetrics, isHigherBetter: boolean = true) => {
    const value = comparisonMetrics[propertyId]?.[metric] as number;
    const bestValue = getBestValue(metric, isHigherBetter);
    return value === bestValue;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const hasFeature = (property: Property, feature: string): boolean => {
    return property.features?.includes(feature) || false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Fastighetsjämförelse</h2>
        </div>
        <p className="text-lg text-muted-foreground">
          Jämför fastigheter sida vid sida för att fatta välgrundade beslut
        </p>
      </div>

      {/* Search and Add Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Lägg till fastigheter ({selectedProperties.length}/4)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Sök fastigheter att jämföra..."
              onKeyDown={(e) => e.key === 'Enter' && searchProperties()}
            />
            <Button onClick={searchProperties} disabled={loading}>
              {loading ? 'Söker...' : 'Sök'}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <Label>Sökresultat:</Label>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {searchResults.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{property.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {property.address_street}, {property.address_city}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{formatPrice(property.price)}</span>
                        <span>{property.living_area} m²</span>
                        <span>{property.rooms} rum</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => addPropertyToComparison(property)}
                      disabled={selectedProperties.length >= 4}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {selectedProperties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Jämförelse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2 border-b font-medium">Egenskap</th>
                    {selectedProperties.map((property) => (
                      <th key={property.id} className="text-center p-2 border-b font-medium min-w-48">
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <span className="font-semibold">{property.title}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removePropertyFromComparison(property.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {comparisonMetrics[property.id] && (
                            <Badge className={`${getScoreColor(comparisonMetrics[property.id].overallScore)} border-0`}>
                              <Star className="h-3 w-3 mr-1" />
                              {comparisonMetrics[property.id].overallScore} poäng
                            </Badge>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Basic Information */}
                  <tr>
                    <td className="p-2 border-b font-medium">Pris</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className={`text-center p-2 border-b ${
                        isHighlighted(property.id, 'pricePerSqm', false) ? 'bg-green-50 font-semibold' : ''
                      }`}>
                        {formatPrice(property.price)}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-2 border-b font-medium">Pris per m²</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className={`text-center p-2 border-b ${
                        isHighlighted(property.id, 'pricePerSqm', false) ? 'bg-green-50 font-semibold' : ''
                      }`}>
                        {comparisonMetrics[property.id] && formatPricePerSqm(comparisonMetrics[property.id].pricePerSqm)}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-2 border-b font-medium">Boarea</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="text-center p-2 border-b">
                        {property.living_area} m²
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-2 border-b font-medium">Rum</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="text-center p-2 border-b">
                        {property.rooms}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-2 border-b font-medium">Byggår</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="text-center p-2 border-b">
                        {property.year_built || 'Ej angivet'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-2 border-b font-medium">Månadsavgift</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="text-center p-2 border-b">
                        {property.monthly_fee ? formatPrice(property.monthly_fee) : 'Ej angivet'}
                      </td>
                    ))}
                  </tr>

                  {/* Market Analysis */}
                  <tr>
                    <td className="p-2 border-b font-medium bg-nordic-ice">Marknadsvärde (AI)</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className={`text-center p-2 border-b bg-nordic-ice ${
                        isHighlighted(property.id, 'marketValue', true) ? 'font-semibold text-green-600' : ''
                      }`}>
                        {comparisonMetrics[property.id] && formatPrice(comparisonMetrics[property.id].marketValue)}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-2 border-b font-medium bg-nordic-ice">Tillväxtpotential</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className={`text-center p-2 border-b bg-nordic-ice ${
                        isHighlighted(property.id, 'potentialAppreciation', true) ? 'font-semibold text-green-600' : ''
                      }`}>
                        {comparisonMetrics[property.id] && 
                          `+${comparisonMetrics[property.id].potentialAppreciation.toFixed(1)}%`
                        }
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-2 border-b font-medium bg-nordic-ice">Gångbarhet</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className={`text-center p-2 border-b bg-nordic-ice ${
                        isHighlighted(property.id, 'walkScore', true) ? 'font-semibold text-green-600' : ''
                      }`}>
                        {comparisonMetrics[property.id] && 
                          `${comparisonMetrics[property.id].walkScore}/100`
                        }
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-2 border-b font-medium bg-nordic-ice">Skolbetyg</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className={`text-center p-2 border-b bg-blue-50 ${
                        isHighlighted(property.id, 'schoolRating', true) ? 'font-semibold text-green-600' : ''
                      }`}>
                        {comparisonMetrics[property.id] && 
                          `${comparisonMetrics[property.id].schoolRating.toFixed(1)}/10`
                        }
                      </td>
                    ))}
                  </tr>

                  {/* Features Comparison */}
                  <tr>
                    <td className="p-2 border-b font-medium bg-gray-50">Balkong</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="text-center p-2 border-b bg-gray-50">
                        {hasFeature(property, 'balkong') ? 
                          <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
                          <Minus className="h-5 w-5 text-gray-400 mx-auto" />
                        }
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-2 border-b font-medium bg-gray-50">Hiss</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="text-center p-2 border-b bg-gray-50">
                        {hasFeature(property, 'hiss') ? 
                          <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
                          <Minus className="h-5 w-5 text-gray-400 mx-auto" />
                        }
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-2 border-b font-medium bg-gray-50">Parkering</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="text-center p-2 border-b bg-gray-50">
                        {hasFeature(property, 'garage') || hasFeature(property, 'parkering') ? 
                          <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
                          <Minus className="h-5 w-5 text-gray-400 mx-auto" />
                        }
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Jämförelsesammanfattning</h4>
              <div className="text-sm space-y-1">
                {Object.keys(comparisonMetrics).length > 0 && (
                  <>
                    <p>
                      • <strong>Bästa prislägget:</strong> {
                        selectedProperties.find(p => isHighlighted(p.id, 'pricePerSqm', false))?.title || 'N/A'
                      }
                    </p>
                    <p>
                      • <strong>Högsta tillväxtpotential:</strong> {
                        selectedProperties.find(p => isHighlighted(p.id, 'potentialAppreciation', true))?.title || 'N/A'
                      }
                    </p>
                    <p>
                      • <strong>Bästa läge:</strong> {
                        selectedProperties.find(p => isHighlighted(p.id, 'walkScore', true))?.title || 'N/A'
                      }
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {selectedProperties.length === 0 && (
        <Card>
          <CardContent className="text-center p-8">
            <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ingen jämförelse aktiverad</h3>
            <p className="text-muted-foreground">
              Sök efter och lägg till fastigheter för att börja jämföra dem.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyComparison;