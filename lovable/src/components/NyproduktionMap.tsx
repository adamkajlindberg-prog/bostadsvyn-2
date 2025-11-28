import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PropertyMap from './PropertyMap';
import { Loader2 } from 'lucide-react';

type SortOption = 'latest' | 'price_asc' | 'price_desc';

interface NyproduktionMapProps {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  sort?: SortOption;
}

const NyproduktionMap: React.FC<NyproduktionMapProps> = ({
  search,
  minPrice,
  maxPrice,
  type,
  sort = 'latest',
}) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNyproduktionProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, minPrice, maxPrice, type, sort]);

  const loadNyproduktionProperties = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'COMING_SOON')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (type && type !== 'ALL') {
        query = query.eq('property_type', type);
      }
      if (typeof minPrice === 'number') {
        query = query.gte('price', minPrice);
      }
      if (typeof maxPrice === 'number') {
        query = query.lte('price', maxPrice);
      }
      if (search && search.trim().length > 0) {
        const s = search.trim();
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
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      setProperties(data || []);
    } catch (error) {
      console.error('Error loading nyproduktion properties for map:', error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[480px] rounded-xl border bg-card flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[480px] rounded-xl overflow-hidden">
      <PropertyMap properties={properties} />
    </div>
  );
};

export default NyproduktionMap;
