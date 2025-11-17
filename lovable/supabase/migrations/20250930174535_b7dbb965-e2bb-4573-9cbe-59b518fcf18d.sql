-- Create broker offices table
CREATE TABLE public.broker_offices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_name TEXT NOT NULL,
  office_address TEXT,
  office_city TEXT,
  office_postal_code TEXT,
  office_phone TEXT,
  office_email TEXT,
  office_website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create brokers table with office reference
CREATE TABLE public.brokers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  office_id UUID REFERENCES public.broker_offices(id) ON DELETE CASCADE NOT NULL,
  broker_name TEXT NOT NULL,
  broker_phone TEXT,
  broker_email TEXT NOT NULL,
  license_number TEXT,
  specialization TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.broker_offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brokers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for broker_offices
CREATE POLICY "Anyone can view offices"
  ON public.broker_offices
  FOR SELECT
  USING (true);

CREATE POLICY "Brokers can insert offices"
  ON public.broker_offices
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Office brokers can update their office"
  ON public.broker_offices
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.brokers
    WHERE brokers.office_id = broker_offices.id
    AND brokers.user_id = auth.uid()
  ));

-- RLS Policies for brokers
CREATE POLICY "Anyone can view brokers"
  ON public.brokers
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own broker profile"
  ON public.brokers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Brokers can update their own profile"
  ON public.brokers
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_brokers_office_id ON public.brokers(office_id);
CREATE INDEX idx_brokers_user_id ON public.brokers(user_id);

-- Add property stats view for market share calculations
CREATE OR REPLACE VIEW public.broker_property_stats AS
SELECT 
  b.id as broker_id,
  b.broker_name,
  bo.id as office_id,
  bo.office_name,
  p.status,
  p.property_type,
  p.address_city,
  p.address_postal_code,
  p.address_street,
  COUNT(*) as property_count,
  AVG(p.price) as avg_price,
  SUM(p.living_area) as total_area
FROM public.brokers b
JOIN public.broker_offices bo ON b.office_id = bo.id
LEFT JOIN public.properties p ON p.user_id = b.user_id
GROUP BY b.id, b.broker_name, bo.id, bo.office_name, p.status, p.property_type, 
         p.address_city, p.address_postal_code, p.address_street;

-- Grant access to the view
GRANT SELECT ON public.broker_property_stats TO authenticated;