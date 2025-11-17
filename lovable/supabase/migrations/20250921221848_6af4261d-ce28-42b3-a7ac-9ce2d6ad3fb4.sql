-- Enable RLS on ad_tier_features table
ALTER TABLE public.ad_tier_features ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read ad tier features (they're configuration data)
CREATE POLICY "Anyone can view ad tier features" 
ON public.ad_tier_features 
FOR SELECT 
USING (true);

-- Only admins can manage ad tier features
CREATE POLICY "Admins can manage ad tier features" 
ON public.ad_tier_features 
FOR ALL 
USING (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::user_role))))
WITH CHECK (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::user_role))));