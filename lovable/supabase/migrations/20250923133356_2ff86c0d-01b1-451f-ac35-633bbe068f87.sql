-- Fix security linter issues

-- 1. Enable RLS on spatial_ref_sys (PostGIS system table - safe to enable)
ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read spatial reference systems (they are public data)
CREATE POLICY "Everyone can read spatial reference systems"
ON public.spatial_ref_sys
FOR SELECT
TO public
USING (true);

-- 2. Fix function search path issue by updating the function with proper search_path
CREATE OR REPLACE FUNCTION public.update_family_property_status()
RETURNS TRIGGER AS $$
DECLARE
  total_members INTEGER;
  yes_votes INTEGER;
  no_votes INTEGER;
  maybe_votes INTEGER;
  new_status TEXT;
BEGIN
  -- Get total family members
  SELECT COUNT(*) INTO total_members
  FROM public.family_members fm
  WHERE fm.family_id = NEW.family_id;
  
  -- Get vote counts for this property
  SELECT 
    COUNT(CASE WHEN vote = 'yes' THEN 1 END),
    COUNT(CASE WHEN vote = 'no' THEN 1 END),
    COUNT(CASE WHEN vote = 'maybe' THEN 1 END)
  INTO yes_votes, no_votes, maybe_votes
  FROM public.family_property_votes fpv
  WHERE fpv.family_id = NEW.family_id AND fpv.property_id = NEW.property_id;
  
  -- Determine new status based on majority
  IF yes_votes > (total_members / 2) THEN
    new_status := 'approved';
  ELSIF no_votes > (total_members / 2) THEN
    new_status := 'rejected';
  ELSIF (maybe_votes + no_votes) > (total_members / 2) THEN
    new_status := 'maybe';
  ELSE
    new_status := 'voting';
  END IF;
  
  -- Update family property status
  UPDATE public.family_properties
  SET status = new_status, updated_at = now()
  WHERE family_id = NEW.family_id AND property_id = NEW.property_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;