-- Skapa tabell för geografiska områden (kommuner, län, etc.)
CREATE TABLE public.geographic_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  area_type TEXT NOT NULL, -- 'municipality', 'county', 'district', 'street'
  parent_id UUID REFERENCES public.geographic_areas(id),
  coordinates JSONB, -- GeoJSON för området
  center_lat NUMERIC,
  center_lng NUMERIC,
  postal_codes TEXT[],
  population INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skapa tabell för prishistorik
CREATE TABLE public.property_sales_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  address_street TEXT NOT NULL,
  address_postal_code TEXT NOT NULL,
  address_city TEXT NOT NULL,
  sale_price BIGINT NOT NULL,
  sale_date DATE NOT NULL,
  living_area INTEGER,
  rooms INTEGER,
  property_type TEXT NOT NULL,
  price_per_sqm INTEGER,
  latitude NUMERIC,
  longitude NUMERIC,
  geographic_area_id UUID REFERENCES public.geographic_areas(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skapa index för bättre prestanda
CREATE INDEX idx_geographic_areas_type ON public.geographic_areas(area_type);
CREATE INDEX idx_geographic_areas_parent ON public.geographic_areas(parent_id);
CREATE INDEX idx_geographic_areas_name ON public.geographic_areas(name);
CREATE INDEX idx_property_sales_date ON public.property_sales_history(sale_date);
CREATE INDEX idx_property_sales_location ON public.property_sales_history(latitude, longitude);
CREATE INDEX idx_property_sales_area ON public.property_sales_history(geographic_area_id);

-- Enable RLS
ALTER TABLE public.geographic_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_sales_history ENABLE ROW LEVEL SECURITY;

-- RLS policies för geographic_areas
CREATE POLICY "Everyone can view geographic areas" 
ON public.geographic_areas 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage geographic areas" 
ON public.geographic_areas 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() 
  AND user_roles.role = 'admin'
));

-- RLS policies för property_sales_history
CREATE POLICY "Everyone can view sales history" 
ON public.property_sales_history 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage sales history" 
ON public.property_sales_history 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() 
  AND user_roles.role = 'admin'
));

-- Trigger för updated_at
CREATE TRIGGER update_geographic_areas_updated_at
  BEFORE UPDATE ON public.geographic_areas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_property_sales_history_updated_at
  BEFORE UPDATE ON public.property_sales_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();