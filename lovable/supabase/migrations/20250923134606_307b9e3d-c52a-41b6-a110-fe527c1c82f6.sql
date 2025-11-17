-- Rename tables from family to group
ALTER TABLE public.families RENAME TO groups;
ALTER TABLE public.family_members RENAME TO group_members;
ALTER TABLE public.family_property_votes RENAME TO group_property_votes;
ALTER TABLE public.family_properties RENAME TO group_properties;

-- Rename columns to match new terminology
ALTER TABLE public.groups RENAME COLUMN created_by TO created_by;
ALTER TABLE public.group_members RENAME COLUMN family_id TO group_id;
ALTER TABLE public.group_property_votes RENAME COLUMN family_id TO group_id;
ALTER TABLE public.group_properties RENAME COLUMN family_id TO group_id;

-- Update foreign key references
ALTER TABLE public.group_members DROP CONSTRAINT family_members_family_id_fkey;
ALTER TABLE public.group_members ADD CONSTRAINT group_members_group_id_fkey 
  FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;

ALTER TABLE public.group_property_votes DROP CONSTRAINT family_property_votes_family_id_fkey;
ALTER TABLE public.group_property_votes ADD CONSTRAINT group_property_votes_group_id_fkey 
  FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;

ALTER TABLE public.group_properties DROP CONSTRAINT family_properties_family_id_fkey;
ALTER TABLE public.group_properties ADD CONSTRAINT group_properties_group_id_fkey 
  FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;

-- Update RLS policies for groups table
DROP POLICY "Family members can view their family" ON public.groups;
DROP POLICY "Users can create families" ON public.groups;
DROP POLICY "Family creators can update their family" ON public.groups;

CREATE POLICY "Group members can view their group"
ON public.groups
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.group_members gm 
  WHERE gm.group_id = groups.id AND gm.user_id = auth.uid()
));

CREATE POLICY "Users can create groups"
ON public.groups
FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update their group"  
ON public.groups
FOR UPDATE
USING (auth.uid() = created_by);

-- Update RLS policies for group_members table
DROP POLICY "Family members can view family membership" ON public.group_members;
DROP POLICY "Users can join families" ON public.group_members;
DROP POLICY "Family members can leave family" ON public.group_members;

CREATE POLICY "Group members can view group membership"
ON public.group_members
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.group_members gm 
  WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid()
));

CREATE POLICY "Users can join groups"
ON public.group_members
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Group members can leave group"
ON public.group_members
FOR DELETE
USING (auth.uid() = user_id);

-- Update RLS policies for group_property_votes table
DROP POLICY "Family members can view votes in their family" ON public.group_property_votes;
DROP POLICY "Family members can vote" ON public.group_property_votes;
DROP POLICY "Users can update their own votes" ON public.group_property_votes;

CREATE POLICY "Group members can view votes in their group"
ON public.group_property_votes
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.group_members gm 
  WHERE gm.group_id = group_property_votes.group_id AND gm.user_id = auth.uid()
));

CREATE POLICY "Group members can vote"
ON public.group_property_votes
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM public.group_members gm 
    WHERE gm.group_id = group_property_votes.group_id AND gm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own votes"
ON public.group_property_votes
FOR UPDATE
USING (auth.uid() = user_id);

-- Update RLS policies for group_properties table
DROP POLICY "Family members can view family properties" ON public.group_properties;
DROP POLICY "Family members can add properties" ON public.group_properties;
DROP POLICY "Family members can update family properties" ON public.group_properties;

CREATE POLICY "Group members can view group properties"
ON public.group_properties
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.group_members gm 
  WHERE gm.group_id = group_properties.group_id AND gm.user_id = auth.uid()
));

CREATE POLICY "Group members can add properties"
ON public.group_properties
FOR INSERT
WITH CHECK (
  auth.uid() = added_by AND 
  EXISTS (
    SELECT 1 FROM public.group_members gm 
    WHERE gm.group_id = group_properties.group_id AND gm.user_id = auth.uid()
  )
);

CREATE POLICY "Group members can update group properties"
ON public.group_properties
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.group_members gm 
  WHERE gm.group_id = group_properties.group_id AND gm.user_id = auth.uid()
));

-- Update function to work with new table names
CREATE OR REPLACE FUNCTION public.update_group_property_status()
RETURNS TRIGGER AS $$
DECLARE
  total_members INTEGER;
  yes_votes INTEGER;
  no_votes INTEGER;  
  maybe_votes INTEGER;
  new_status TEXT;
BEGIN
  -- Get total group members
  SELECT COUNT(*) INTO total_members
  FROM public.group_members gm
  WHERE gm.group_id = NEW.group_id;
  
  -- Get vote counts for this property
  SELECT 
    COUNT(CASE WHEN vote = 'yes' THEN 1 END),
    COUNT(CASE WHEN vote = 'no' THEN 1 END),
    COUNT(CASE WHEN vote = 'maybe' THEN 1 END)
  INTO yes_votes, no_votes, maybe_votes
  FROM public.group_property_votes gpv
  WHERE gpv.group_id = NEW.group_id AND gpv.property_id = NEW.property_id;
  
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
  
  -- Update group property status
  UPDATE public.group_properties
  SET status = new_status, updated_at = now()
  WHERE group_id = NEW.group_id AND property_id = NEW.property_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop old trigger and function
DROP TRIGGER IF EXISTS update_family_property_status_trigger ON public.group_property_votes;
DROP FUNCTION IF EXISTS public.update_family_property_status();

-- Create new trigger
CREATE TRIGGER update_group_property_status_trigger
AFTER INSERT OR UPDATE ON public.group_property_votes
FOR EACH ROW
EXECUTE FUNCTION public.update_group_property_status();

-- Update indexes
DROP INDEX IF EXISTS idx_family_members_family_id;
DROP INDEX IF EXISTS idx_family_members_user_id;
DROP INDEX IF EXISTS idx_family_property_votes_family_property;
DROP INDEX IF EXISTS idx_family_properties_family_id;
DROP INDEX IF EXISTS idx_families_invite_code;

CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX idx_group_property_votes_group_property ON public.group_property_votes(group_id, property_id);
CREATE INDEX idx_group_properties_group_id ON public.group_properties(group_id);
CREATE INDEX idx_groups_invite_code ON public.groups(invite_code);