-- Enable PostGIS extension for spatial operations
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create improved function to search properties within geographic boundaries
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
  property_type TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  status TEXT,
  rooms INTEGER,
  living_area INTEGER,
  images TEXT[],
  created_at TIMESTAMPTZ,
  distance_km NUMERIC
) 
LANGUAGE plpgsql
AS $$
DECLARE
  area_coords JSONB;
  area_center_lat NUMERIC;
  area_center_lng NUMERIC;
BEGIN  
  -- First try to find exact geographic area match
  SELECT coordinates, center_lat, center_lng INTO area_coords, area_center_lat, area_center_lng
  FROM geographic_areas 
  WHERE name ILIKE search_query OR name ILIKE '%' || search_query || '%'
  LIMIT 1;

  IF area_coords IS NOT NULL AND area_center_lat IS NOT NULL AND area_center_lng IS NOT NULL THEN
    -- Use geographic area center with expanding radius search
    RETURN QUERY
    SELECT 
      p.id, p.title, p.price, p.address_street, p.address_city, 
      p.property_type, p.latitude, p.longitude, p.status,
      p.rooms, p.living_area, p.images, p.created_at,
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
          WHEN (SELECT area_type FROM geographic_areas WHERE coordinates = area_coords LIMIT 1) = 'municipality' THEN 50000  -- 50km for municipalities
          WHEN (SELECT area_type FROM geographic_areas WHERE coordinates = area_coords LIMIT 1) = 'district' THEN 5000       -- 5km for districts  
          ELSE 2000  -- 2km for other areas
        END
      )
    ORDER BY distance_km ASC;
  ELSE
    -- Fallback to text-based search with distance from address matches
    RETURN QUERY
    SELECT 
      p.id, p.title, p.price, p.address_street, p.address_city,
      p.property_type, p.latitude, p.longitude, p.status,
      p.rooms, p.living_area, p.images, p.created_at,
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

-- Create function to search sales history in geographic areas
CREATE OR REPLACE FUNCTION search_sales_in_area(
  search_query TEXT,
  start_year INTEGER DEFAULT 2010,
  end_year INTEGER DEFAULT 2024
)
RETURNS TABLE (
  id UUID,
  address_street TEXT,
  address_city TEXT,
  sale_price BIGINT,
  sale_date DATE,
  property_type TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  living_area INTEGER,
  rooms INTEGER,
  price_per_sqm INTEGER,
  distance_km NUMERIC
) 
LANGUAGE plpgsql
AS $$
DECLARE
  area_coords JSONB;
  area_center_lat NUMERIC;
  area_center_lng NUMERIC;
BEGIN
  -- Try to find geographic area match
  SELECT coordinates, center_lat, center_lng INTO area_coords, area_center_lat, area_center_lng
  FROM geographic_areas 
  WHERE name ILIKE search_query OR name ILIKE '%' || search_query || '%'
  LIMIT 1;

  IF area_coords IS NOT NULL AND area_center_lat IS NOT NULL AND area_center_lng IS NOT NULL THEN
    -- Use geographic area center with radius search
    RETURN QUERY
    SELECT 
      s.id, s.address_street, s.address_city, s.sale_price, s.sale_date,
      s.property_type, s.latitude, s.longitude, s.living_area, s.rooms, s.price_per_sqm,
      ROUND(
        ST_Distance(
          ST_MakePoint(area_center_lng, area_center_lat)::geography,
          ST_MakePoint(s.longitude, s.latitude)::geography
        ) / 1000, 2
      ) as distance_km
    FROM property_sales_history s
    WHERE s.latitude IS NOT NULL 
      AND s.longitude IS NOT NULL
      AND EXTRACT(YEAR FROM s.sale_date) BETWEEN start_year AND end_year
      AND ST_DWithin(
        ST_MakePoint(area_center_lng, area_center_lat)::geography,
        ST_MakePoint(s.longitude, s.latitude)::geography,
        CASE 
          WHEN (SELECT area_type FROM geographic_areas WHERE coordinates = area_coords LIMIT 1) = 'municipality' THEN 50000
          WHEN (SELECT area_type FROM geographic_areas WHERE coordinates = area_coords LIMIT 1) = 'district' THEN 5000
          ELSE 2000
        END
      )
    ORDER BY distance_km ASC, s.sale_date DESC;
  ELSE
    -- Fallback to text search
    RETURN QUERY
    SELECT 
      s.id, s.address_street, s.address_city, s.sale_price, s.sale_date,
      s.property_type, s.latitude, s.longitude, s.living_area, s.rooms, s.price_per_sqm,
      0::NUMERIC as distance_km
    FROM property_sales_history s
    WHERE EXTRACT(YEAR FROM s.sale_date) BETWEEN start_year AND end_year
      AND (
        s.address_city ILIKE '%' || search_query || '%' OR
        s.address_street ILIKE '%' || search_query || '%'
      )
    ORDER BY s.sale_date DESC;
  END IF;
END;
$$;