-- Helper functions to avoid RLS recursion on user_roles
CREATE OR REPLACE FUNCTION public.has_role(p_user_id uuid, p_role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = p_user_id AND ur.role::text = p_role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(p_user_id, 'admin');
$$;

CREATE OR REPLACE FUNCTION public.is_broker_or_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(p_user_id, 'broker') OR public.has_role(p_user_id, 'admin');
$$;

-- Update user_roles policy to remove self-reference (fix infinite recursion)
DROP POLICY IF EXISTS "Manage user roles" ON public.user_roles;
CREATE POLICY "Manage user roles" ON public.user_roles
FOR ALL
USING ((auth.uid() = user_id) OR public.is_admin(auth.uid()))
WITH CHECK ((auth.uid() = user_id) OR public.is_admin(auth.uid()));

-- Optional: ensure view policy remains
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Fix ambiguous area_type in spatial RPC
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
  area_type_var TEXT;
BEGIN  
  -- Try to find geographic area match
  SELECT coordinates, center_lat, center_lng, area_type INTO area_coords, area_center_lat, area_center_lng, area_type_var
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
          WHEN area_type_var = 'municipality' THEN 50000
          WHEN area_type_var = 'district' THEN 5000
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