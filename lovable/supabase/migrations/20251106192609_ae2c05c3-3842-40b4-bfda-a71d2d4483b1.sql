-- Create table for final price watchers (leads who want to be notified about final sale price)
CREATE TABLE IF NOT EXISTS public.property_final_price_watchers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  notify_via_email BOOLEAN NOT NULL DEFAULT true,
  notify_via_sms BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active',
  notified BOOLEAN NOT NULL DEFAULT false,
  notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT valid_status CHECK (status IN ('active', 'notified', 'cancelled'))
);

-- Enable RLS
ALTER TABLE public.property_final_price_watchers ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can register to watch final price (create leads)
CREATE POLICY "Anyone can register to watch final price"
ON public.property_final_price_watchers
FOR INSERT
WITH CHECK (true);

-- Policy: Property owners can view watchers for their properties
CREATE POLICY "Property owners can view watchers for their properties"
ON public.property_final_price_watchers
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_final_price_watchers.property_id
    AND p.user_id = auth.uid()
  )
);

-- Policy: Brokers can view all watchers
CREATE POLICY "Brokers can view all watchers"
ON public.property_final_price_watchers
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('broker', 'admin')
  )
);

-- Policy: Property owners and brokers can update watcher status
CREATE POLICY "Property owners and brokers can update watchers"
ON public.property_final_price_watchers
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_final_price_watchers.property_id
    AND p.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('broker', 'admin')
  )
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_final_price_watchers_property_id ON public.property_final_price_watchers(property_id);
CREATE INDEX IF NOT EXISTS idx_final_price_watchers_status ON public.property_final_price_watchers(status);
CREATE INDEX IF NOT EXISTS idx_final_price_watchers_created_at ON public.property_final_price_watchers(created_at DESC);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_final_price_watchers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_final_price_watchers_updated_at
BEFORE UPDATE ON public.property_final_price_watchers
FOR EACH ROW
EXECUTE FUNCTION public.update_final_price_watchers_updated_at();