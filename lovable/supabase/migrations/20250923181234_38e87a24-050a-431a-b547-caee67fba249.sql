-- Create missing tables for enhanced property data
CREATE TABLE IF NOT EXISTS public.property_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  property_type TEXT NOT NULL,
  price BIGINT,
  rooms INTEGER,
  area_sqm INTEGER,
  year_built INTEGER,
  energy_rating TEXT,
  description TEXT,
  agent_id UUID,
  listing_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sold_date TIMESTAMP WITH TIME ZONE,
  sold_price BIGINT,
  listing_status TEXT DEFAULT 'active',
  coordinates POINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.market_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region TEXT NOT NULL,
  property_type TEXT NOT NULL,
  date_period TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  average_price BIGINT,
  median_price BIGINT,
  price_per_sqm INTEGER,
  days_on_market INTEGER,
  number_of_sales INTEGER,
  price_trend_percent DECIMAL(4,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.area_information (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  area_name TEXT NOT NULL,
  municipality TEXT NOT NULL,
  region TEXT NOT NULL,
  population INTEGER,
  schools_rating DECIMAL(2,1),
  crime_index INTEGER,
  transport_score INTEGER,
  amenities_score INTEGER,
  investment_potential TEXT,
  family_friendliness INTEGER,
  walkability_score INTEGER,
  coordinates POINT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.property_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.area_information ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Property listings are viewable by everyone" 
ON public.property_listings FOR SELECT USING (true);

CREATE POLICY "Market analytics are viewable by everyone" 
ON public.market_analytics FOR SELECT USING (true);

CREATE POLICY "Area information is viewable by everyone" 
ON public.area_information FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_property_listings_city ON public.property_listings(city);
CREATE INDEX IF NOT EXISTS idx_property_listings_price ON public.property_listings(price);
CREATE INDEX IF NOT EXISTS idx_property_listings_status ON public.property_listings(listing_status);
CREATE INDEX IF NOT EXISTS idx_market_analytics_region ON public.market_analytics(region);
CREATE INDEX IF NOT EXISTS idx_area_information_municipality ON public.area_information(municipality);