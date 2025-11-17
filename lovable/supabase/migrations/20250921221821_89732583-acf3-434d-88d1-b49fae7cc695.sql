-- Add ad_tier to properties table and create ads table
ALTER TABLE public.properties 
ADD COLUMN ad_tier TEXT NOT NULL DEFAULT 'free' CHECK (ad_tier IN ('free', 'plus', 'premium'));

-- Create ads table for managing different ad types and their features
CREATE TABLE public.ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  ad_tier TEXT NOT NULL DEFAULT 'free' CHECK (ad_tier IN ('free', 'plus', 'premium')),
  title TEXT NOT NULL,
  description TEXT,
  custom_image_url TEXT,
  ai_generated_image_url TEXT,
  priority_score INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS for ads
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Create policies for ads
CREATE POLICY "Anyone can view active ads" 
ON public.ads 
FOR SELECT 
USING (expires_at IS NULL OR expires_at > now());

CREATE POLICY "Users can manage their own ads" 
ON public.ads 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Brokers can view all ads" 
ON public.ads 
FOR SELECT 
USING (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'broker'::user_role))));

-- Add trigger for updating updated_at on ads
CREATE TRIGGER update_ads_updated_at
  BEFORE UPDATE ON public.ads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create ad features lookup table
CREATE TABLE public.ad_tier_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_tier TEXT NOT NULL CHECK (ad_tier IN ('free', 'plus', 'premium')),
  feature_name TEXT NOT NULL,
  feature_description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default features for each tier
INSERT INTO public.ad_tier_features (ad_tier, feature_name, feature_description) VALUES
('free', 'basic_listing', 'Basic property listing'),
('free', 'standard_size', 'Standard ad size'),
('plus', 'basic_listing', 'Basic property listing'),
('plus', 'standard_size', 'Standard ad size'),
('plus', 'larger_size', 'Larger ad display'),
('plus', 'priority_placement', 'Higher priority in search results'),
('premium', 'basic_listing', 'Basic property listing'),
('premium', 'standard_size', 'Standard ad size'),
('premium', 'larger_size', 'Larger ad display'),
('premium', 'priority_placement', 'Higher priority in search results'),
('premium', 'ai_image_generation', 'AI-powered image generation'),
('premium', 'premium_badge', 'Premium ad badge'),
('premium', 'featured_placement', 'Featured placement in listings'),
('premium', 'analytics_tracking', 'Advanced analytics and insights');