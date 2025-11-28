import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PropertyMap from './PropertyMap';
import { Loader2 } from 'lucide-react';

interface CommercialMapProps {
  search?: string;
  type?: string;
  minArea?: number;
  maxArea?: number;
  status?: string;
}

const CommercialMap: React.FC<CommercialMapProps> = ({
  search,
  type,
  minArea,
  maxArea,
  status,
}) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCommercialProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, type, minArea, maxArea, status]);

  const loadCommercialProperties = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('properties')
        .select('*')
        .eq('property_type', 'COMMERCIAL')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (status && status !== 'ALL') {
        query = query.eq('status', status);
      } else {
        query = query.in('status', ['FOR_SALE', 'FOR_RENT', 'COMING_SOON']);
      }

      if (typeof minArea === 'number') {
        query = query.gte('living_area', minArea);
      }
      if (typeof maxArea === 'number') {
        query = query.lte('living_area', maxArea);
      }
      if (search && search.trim().length > 0) {
        const s = search.trim();
        query = query.or(
          `title.ilike.%${s}%,address_city.ilike.%${s}%,address_street.ilike.%${s}%`
        );
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      setProperties(data || []);
    } catch (error) {
      console.error('Error loading commercial properties for map:', error);
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

export default CommercialMap;
