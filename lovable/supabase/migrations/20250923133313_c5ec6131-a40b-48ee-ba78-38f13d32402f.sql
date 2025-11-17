-- Create families table
CREATE TABLE public.families (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL DEFAULT substring(gen_random_uuid()::text from 1 for 8),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create family members table
CREATE TABLE public.family_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(family_id, user_id)
);

-- Create family property votes table
CREATE TABLE public.family_property_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  property_id UUID NOT NULL,
  user_id UUID NOT NULL,
  vote TEXT NOT NULL CHECK (vote IN ('yes', 'no', 'maybe')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(family_id, property_id, user_id)
);

-- Create family properties table (shared favorites)
CREATE TABLE public.family_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  property_id UUID NOT NULL,
  added_by UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'voting' CHECK (status IN ('voting', 'approved', 'rejected', 'maybe')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(family_id, property_id)
);

-- Enable Row Level Security
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_property_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies for families
CREATE POLICY "Family members can view their family"
ON public.families
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.family_members fm 
  WHERE fm.family_id = families.id AND fm.user_id = auth.uid()
));

CREATE POLICY "Users can create families"
ON public.families
FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Family creators can update their family"
ON public.families
FOR UPDATE
USING (auth.uid() = created_by);

-- RLS Policies for family_members
CREATE POLICY "Family members can view family membership"
ON public.family_members
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.family_members fm 
  WHERE fm.family_id = family_members.family_id AND fm.user_id = auth.uid()
));

CREATE POLICY "Users can join families"
ON public.family_members
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Family members can leave family"
ON public.family_members
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for family_property_votes
CREATE POLICY "Family members can view votes in their family"
ON public.family_property_votes
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.family_members fm 
  WHERE fm.family_id = family_property_votes.family_id AND fm.user_id = auth.uid()
));

CREATE POLICY "Family members can vote"
ON public.family_property_votes
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM public.family_members fm 
    WHERE fm.family_id = family_property_votes.family_id AND fm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own votes"
ON public.family_property_votes
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for family_properties
CREATE POLICY "Family members can view family properties"
ON public.family_properties
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.family_members fm 
  WHERE fm.family_id = family_properties.family_id AND fm.user_id = auth.uid()
));

CREATE POLICY "Family members can add properties"
ON public.family_properties
FOR INSERT
WITH CHECK (
  auth.uid() = added_by AND 
  EXISTS (
    SELECT 1 FROM public.family_members fm 
    WHERE fm.family_id = family_properties.family_id AND fm.user_id = auth.uid()
  )
);

CREATE POLICY "Family members can update family properties"
ON public.family_properties
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.family_members fm 
  WHERE fm.family_id = family_properties.family_id AND fm.user_id = auth.uid()
));

-- Create function to update family property status based on votes
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update status when votes change
CREATE TRIGGER update_family_property_status_trigger
AFTER INSERT OR UPDATE ON public.family_property_votes
FOR EACH ROW
EXECUTE FUNCTION public.update_family_property_status();

-- Create indexes for better performance
CREATE INDEX idx_family_members_family_id ON public.family_members(family_id);
CREATE INDEX idx_family_members_user_id ON public.family_members(user_id);
CREATE INDEX idx_family_property_votes_family_property ON public.family_property_votes(family_id, property_id);
CREATE INDEX idx_family_properties_family_id ON public.family_properties(family_id);
CREATE INDEX idx_families_invite_code ON public.families(invite_code);