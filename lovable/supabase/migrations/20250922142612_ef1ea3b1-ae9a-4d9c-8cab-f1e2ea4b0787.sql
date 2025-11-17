-- Recreate search_properties_in_area with full return type
DROP FUNCTION IF EXISTS search_properties_in_area(text, text[]);

CREATE OR REPLACE FUNCTION search_properties_in_area(
  search_query TEXT,
  property_status TEXT[] DEFAULT ARRAY['FOR_SALE', 'FOR_RENT', 'COMING_SOON']
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  price BIGINT,
  address_street TEXT,
  address_city TEXT,
  address_postal_code TEXT,
  property_type TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  status TEXT,
  rooms INTEGER,
  living_area INTEGER,
  images TEXT[],
  created_at TIMESTAMPTZ,
  user_id UUID,
  description TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  year_built INTEGER,
  energy_class TEXT,
  monthly_fee INTEGER,
  features TEXT[],
  plot_area INTEGER,
  distance_km NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  area_coords JSONB;
  area_center_lat NUMERIC;
  area_center_lng NUMERIC;
  area_type TEXT;
BEGIN  
  -- Try to find geographic area match
  SELECT coordinates, center_lat, center_lng, area_type INTO area_coords, area_center_lat, area_center_lng, area_type
  FROM geographic_areas 
  WHERE name ILIKE search_query OR name ILIKE '%' || search_query || '%'
  LIMIT 1;

  IF area_coords IS NOT NULL AND area_center_lat IS NOT NULL AND area_center_lng IS NOT NULL THEN
    -- Use area center with dynamic radius
    RETURN QUERY
    SELECT 
      p.id, p.title, p.price, p.address_street, p.address_city, p.address_postal_code,
      p.property_type, p.latitude, p.longitude, p.status,
      p.rooms, p.living_area, p.images, p.created_at, p.user_id,
      p.description, p.bedrooms, p.bathrooms, p.year_built, p.energy_class,
      p.monthly_fee, p.features, p.plot_area,
      ROUND(
        ST_Distance(
          ST_MakePoint(area_center_lng, area_center_lat)::geography,
          ST_MakePoint(p.longitude, p.latitude)::geography
        ) / 1000, 2
      ) as distance_km
    FROM properties p
    WHERE p.status = ANY(property_status)
      AND p.latitude IS NOT NULL 
      AND p.longitude IS NOT NULL
      AND ST_DWithin(
        ST_MakePoint(area_center_lng, area_center_lat)::geography,
        ST_MakePoint(p.longitude, p.latitude)::geography,
        CASE 
          WHEN area_type = 'municipality' THEN 50000
          WHEN area_type = 'district' THEN 5000
          ELSE 2000
        END
      )
    ORDER BY distance_km ASC, p.created_at DESC;
  ELSE
    -- Fallback to text-based search
    RETURN QUERY
    SELECT 
      p.id, p.title, p.price, p.address_street, p.address_city, p.address_postal_code,
      p.property_type, p.latitude, p.longitude, p.status,
      p.rooms, p.living_area, p.images, p.created_at, p.user_id,
      p.description, p.bedrooms, p.bathrooms, p.year_built, p.energy_class,
      p.monthly_fee, p.features, p.plot_area,
      0::NUMERIC as distance_km
    FROM properties p
    WHERE p.status = ANY(property_status)
      AND (
        p.address_city ILIKE '%' || search_query || '%' OR
        p.address_street ILIKE '%' || search_query || '%'
      )
    ORDER BY p.created_at DESC;
  END IF;
END;
$$;