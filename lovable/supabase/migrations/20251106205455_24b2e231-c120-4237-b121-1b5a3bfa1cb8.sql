-- Create table for tracking users interested in final price
CREATE TABLE public.property_final_price_interest (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.property_final_price_interest ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can register interest in final price"
ON public.property_final_price_interest
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Property owners can view interest in their properties"
ON public.property_final_price_interest
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_final_price_interest.property_id
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Brokers can view all final price interest"
ON public.property_final_price_interest
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'broker'
  )
);

-- Create index for better performance
CREATE INDEX idx_property_final_price_interest_property_id 
ON public.property_final_price_interest(property_id);

-- Prevent duplicate entries
CREATE UNIQUE INDEX idx_unique_final_price_interest 
ON public.property_final_price_interest(property_id, email);