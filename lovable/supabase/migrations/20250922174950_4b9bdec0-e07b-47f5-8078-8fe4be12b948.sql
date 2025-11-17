-- Skapa tabell för mäklare i Sverige
CREATE TABLE public.real_estate_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  license_number TEXT,
  specialization TEXT[], -- Områden de specialiserar sig på
  active_areas TEXT[], -- Geografiska områden där de är aktiva
  years_experience INTEGER,
  total_sales_last_year INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  profile_image_url TEXT,
  bio TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skapa tabell för mäklares försäljningshistorik
CREATE TABLE public.agent_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES public.real_estate_agents(id),
  sale_id UUID REFERENCES public.property_sales_history(id), -- Länka till befintlig försäljning om finns
  property_address TEXT NOT NULL,
  area TEXT NOT NULL,
  sale_price BIGINT NOT NULL,
  list_price BIGINT,
  sale_date DATE NOT NULL,
  days_on_market INTEGER,
  property_type TEXT NOT NULL,
  living_area INTEGER,
  rooms INTEGER,
  final_bid_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lägg till mäklarinfo i befintlig property_sales_history
ALTER TABLE public.property_sales_history 
ADD COLUMN agent_id UUID REFERENCES public.real_estate_agents(id),
ADD COLUMN listing_price BIGINT,
ADD COLUMN days_on_market INTEGER,
ADD COLUMN final_bid_count INTEGER DEFAULT 0;

-- Skapa index för bättre prestanda
CREATE INDEX idx_real_estate_agents_active_areas ON public.real_estate_agents USING GIN(active_areas);
CREATE INDEX idx_real_estate_agents_company ON public.real_estate_agents(company);
CREATE INDEX idx_agent_sales_area ON public.agent_sales(area);
CREATE INDEX idx_agent_sales_date ON public.agent_sales(sale_date);
CREATE INDEX idx_agent_sales_agent_id ON public.agent_sales(agent_id);

-- RLS policies
ALTER TABLE public.real_estate_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_sales ENABLE ROW LEVEL SECURITY;

-- Alla kan läsa mäklarinformation
CREATE POLICY "Anyone can view real estate agents" 
  ON public.real_estate_agents FOR SELECT 
  USING (true);

-- Admins kan hantera mäklare
CREATE POLICY "Admins can manage real estate agents" 
  ON public.real_estate_agents FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Alla kan läsa försäljningsdata
CREATE POLICY "Anyone can view agent sales" 
  ON public.agent_sales FOR SELECT 
  USING (true);

-- Admins kan hantera försäljningsdata
CREATE POLICY "Admins can manage agent sales" 
  ON public.agent_sales FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Uppdatera timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_real_estate_agents_updated_at
    BEFORE UPDATE ON public.real_estate_agents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();