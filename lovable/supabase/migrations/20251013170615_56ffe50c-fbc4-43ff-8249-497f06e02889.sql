-- DAC 7 Compliance: Create table for landlord tax information
-- This is required for platforms that facilitate rental transactions
-- according to EU Council Directive 2021/514

-- Table for storing landlord information for DAC 7 reporting
CREATE TABLE IF NOT EXISTS public.dac7_landlord_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- Personal/Business Information
  legal_name TEXT NOT NULL,
  business_name TEXT,
  organization_number TEXT, -- For companies
  personal_number TEXT, -- For individuals (encrypted)
  
  -- Address Information
  street_address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'SE',
  
  -- Tax Information
  tin TEXT, -- Tax Identification Number
  vat_number TEXT, -- For businesses
  
  -- Entity Type
  entity_type TEXT NOT NULL CHECK (entity_type IN ('individual', 'company', 'partnership')),
  
  -- Contact Information
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Consent and Verification
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_date TIMESTAMP WITH TIME ZONE,
  verified BOOLEAN NOT NULL DEFAULT false,
  verification_date TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.dac7_landlord_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see and edit their own information
CREATE POLICY "Users can view their own DAC7 info"
  ON public.dac7_landlord_info
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own DAC7 info"
  ON public.dac7_landlord_info
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own DAC7 info"
  ON public.dac7_landlord_info
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Table for tracking rental income (for DAC 7 reporting)
CREATE TABLE IF NOT EXISTS public.dac7_rental_income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_info_id UUID NOT NULL REFERENCES public.dac7_landlord_info(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  -- Property Information
  property_address TEXT NOT NULL,
  property_type TEXT NOT NULL,
  
  -- Income Information
  rental_income DECIMAL(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'SEK',
  reporting_period_start DATE NOT NULL,
  reporting_period_end DATE NOT NULL,
  
  -- Number of rental days
  rental_days INTEGER NOT NULL,
  
  -- Reporting Status
  reported_to_skatteverket BOOLEAN NOT NULL DEFAULT false,
  reported_date TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.dac7_rental_income ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own rental income records
CREATE POLICY "Users can view their own rental income"
  ON public.dac7_rental_income
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rental income"
  ON public.dac7_rental_income
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rental income"
  ON public.dac7_rental_income
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dac7_landlord_user_id ON public.dac7_landlord_info(user_id);
CREATE INDEX IF NOT EXISTS idx_dac7_landlord_verified ON public.dac7_landlord_info(verified);
CREATE INDEX IF NOT EXISTS idx_dac7_rental_income_user_id ON public.dac7_rental_income(user_id);
CREATE INDEX IF NOT EXISTS idx_dac7_rental_income_period ON public.dac7_rental_income(reporting_period_start, reporting_period_end);
CREATE INDEX IF NOT EXISTS idx_dac7_rental_income_reported ON public.dac7_rental_income(reported_to_skatteverket);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_dac7_landlord_info_updated_at
  BEFORE UPDATE ON public.dac7_landlord_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dac7_rental_income_updated_at
  BEFORE UPDATE ON public.dac7_rental_income
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Comment on tables
COMMENT ON TABLE public.dac7_landlord_info IS 'Stores landlord information required for DAC 7 reporting to Skatteverket';
COMMENT ON TABLE public.dac7_rental_income IS 'Tracks rental income for DAC 7 compliance and reporting to Skatteverket';
