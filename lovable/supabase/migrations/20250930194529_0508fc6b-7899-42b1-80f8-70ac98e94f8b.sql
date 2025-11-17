-- Fix infinite recursion in group_members RLS policies
-- Drop the problematic policy that causes recursion
DROP POLICY IF EXISTS "Group members can view group membership" ON public.group_members;

-- Create a security definer function to check group membership
CREATE OR REPLACE FUNCTION public.is_group_member(_group_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_id = _group_id
    AND user_id = _user_id
  );
$$;

-- Create new non-recursive policy for viewing group members
CREATE POLICY "Group members can view their group members"
ON public.group_members
FOR SELECT
USING (
  public.is_group_member(group_id, auth.uid())
);