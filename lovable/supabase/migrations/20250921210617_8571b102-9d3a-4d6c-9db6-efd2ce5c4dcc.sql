-- Create favorites table for users to save properties
CREATE TABLE public.property_favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Enable RLS
ALTER TABLE public.property_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for favorites
CREATE POLICY "Users can manage their own favorites" 
ON public.property_favorites 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create property views tracking table
CREATE TABLE public.property_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id uuid,
  ip_address inet,
  user_agent text,
  viewed_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

-- Create policies for property views
CREATE POLICY "Anyone can insert property views" 
ON public.property_views 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Property owners and brokers can view property analytics" 
ON public.property_views 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.properties p 
    WHERE p.id = property_views.property_id 
    AND p.user_id = auth.uid()
  ) OR 
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('broker', 'admin')
  )
);

-- Add indexes for better performance
CREATE INDEX idx_property_favorites_user_id ON public.property_favorites(user_id);
CREATE INDEX idx_property_favorites_property_id ON public.property_favorites(property_id);
CREATE INDEX idx_property_views_property_id ON public.property_views(property_id);
CREATE INDEX idx_property_views_viewed_at ON public.property_views(viewed_at);

-- Add full-text search index for properties
CREATE INDEX idx_properties_search ON public.properties USING gin(
  to_tsvector('swedish', 
    COALESCE(title, '') || ' ' || 
    COALESCE(description, '') || ' ' || 
    COALESCE(address_street, '') || ' ' || 
    COALESCE(address_city, '') || ' ' ||
    COALESCE(property_type, '')
  )
);