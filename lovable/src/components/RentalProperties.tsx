import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PropertyCard, { Property } from './PropertyCard';
import { Loader2 } from 'lucide-react';

type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'area_asc' | 'area_desc' | 'rooms_asc' | 'rooms_desc';

interface RentalFilters {
  search?: string;
  minRent?: number;
  maxRent?: number;
  type?: string; // e.g. 'APARTMENT' | 'HOUSE' | undefined
  sort?: SortOption;
  onCountChange?: (count: number) => void;
}

const RentalProperties: React.FC<RentalFilters> = ({
  search,
  minRent,
  maxRent,
  type,
  sort = 'latest',
  onCountChange,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRentalProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, minRent, maxRent, type, sort]);

  const loadRentalProperties = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'FOR_RENT');

      if (type && type !== 'ALL') {
        query = query.eq('property_type', type);
      }
      if (typeof minRent === 'number') {
        query = query.gte('price', minRent);
      }
      if (typeof maxRent === 'number') {
        query = query.lte('price', maxRent);
      }
      if (search && search.trim().length > 0) {
        const s = search.trim();
        // Match title, city or street
        query = query.or(
          `title.ilike.%${s}%,address_city.ilike.%${s}%,address_street.ilike.%${s}%`
        );
      }

      switch (sort) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'area_asc':
          query = query.order('area', { ascending: true });
          break;
        case 'area_desc':
          query = query.order('area', { ascending: false });
          break;
        case 'rooms_asc':
          query = query.order('rooms', { ascending: true });
          break;
        case 'rooms_desc':
          query = query.order('rooms', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      const transformedData = (data || []).map((prop: any) => ({
        ...prop,
        viewing_times: [],
        images: Array.isArray(prop.images) ? prop.images : [],
        features: Array.isArray(prop.features) ? prop.features : [],
      }));

      // Sort by ad_tier (premium > plus > free) first, then by the selected sort
      const tierPriority = {
        premium: 3,
        plus: 2,
        free: 1
      };
      transformedData.sort((a: any, b: any) => {
        const aTierPriority = tierPriority[a.ad_tier || 'free'];
        const bTierPriority = tierPriority[b.ad_tier || 'free'];
        if (aTierPriority !== bTierPriority) {
          return bTierPriority - aTierPriority; // Higher priority first
        }
        // If same tier, maintain database sort order
        return 0;
      });

      setProperties(transformedData as any);
      onCountChange?.(transformedData.length);
    } catch (error) {
      console.error('Error loading rental properties:', error);
      onCountChange?.(0);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Inga hyresobjekt tillgängliga just nu.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default RentalProperties;
