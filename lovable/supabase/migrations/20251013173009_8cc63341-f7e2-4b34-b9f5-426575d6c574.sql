-- Fix critical security issues

-- 1. Add explicit policies to deny anonymous access to sensitive tables
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
FOR ALL
TO anon
USING (false);

CREATE POLICY "Deny anonymous access to dac7_landlord_info"
ON public.dac7_landlord_info
FOR ALL
TO anon
USING (false);

CREATE POLICY "Deny anonymous access to dac7_rental_income"
ON public.dac7_rental_income
FOR ALL
TO anon
USING (false);

-- 2. Fix function search paths by adding SET search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 3. Drop and recreate is_group_member function with correct parameters using CASCADE
DROP FUNCTION IF EXISTS public.is_group_member(uuid, uuid) CASCADE;

CREATE FUNCTION public.is_group_member(group_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.group_members 
    WHERE group_id = group_uuid 
    AND user_id = user_uuid
  );
$$;

-- Recreate the policy that depends on is_group_member
CREATE POLICY "Group members can view their group members"
ON public.group_members
FOR SELECT
TO authenticated
USING (public.is_group_member(group_id, auth.uid()));

-- 4. Strengthen viewing_requests policies to prevent data enumeration
DROP POLICY IF EXISTS "Property owners can view requests for their properties" ON public.viewing_requests;
DROP POLICY IF EXISTS "Authenticated users can create viewing requests" ON public.viewing_requests;
DROP POLICY IF EXISTS "Property owners and requesters can update viewing requests" ON public.viewing_requests;

CREATE POLICY "Users can view their own viewing requests"
ON public.viewing_requests
FOR SELECT
TO authenticated
USING (auth.uid() = requester_id);

CREATE POLICY "Property owners can view requests for their properties"
ON public.viewing_requests
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = viewing_requests.property_id 
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Authenticated users can create their own viewing requests"
ON public.viewing_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Property owners can update requests for their properties"
ON public.viewing_requests
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = viewing_requests.property_id 
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Requesters can update their own viewing requests"
ON public.viewing_requests
FOR UPDATE
TO authenticated
USING (auth.uid() = requester_id);

-- 5. Strengthen property_inquiries policies
DROP POLICY IF EXISTS "Anyone can create property inquiries" ON public.property_inquiries;
DROP POLICY IF EXISTS "Property owners can view inquiries for their properties" ON public.property_inquiries;
DROP POLICY IF EXISTS "Property owners can update inquiries" ON public.property_inquiries;

CREATE POLICY "Authenticated or anonymous users can create property inquiries"
ON public.property_inquiries
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view their own inquiries"
ON public.property_inquiries
FOR SELECT
TO authenticated
USING (
  (inquirer_id IS NOT NULL AND auth.uid() = inquirer_id)
);

CREATE POLICY "Property owners can view inquiries for their properties"
ON public.property_inquiries
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_inquiries.property_id 
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Property owners can update inquiries for their properties"
ON public.property_inquiries
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_inquiries.property_id 
    AND p.user_id = auth.uid()
  )
);