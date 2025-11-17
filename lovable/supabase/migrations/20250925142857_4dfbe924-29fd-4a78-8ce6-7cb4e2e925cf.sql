-- Fix user_rate_limits table security issue
-- Remove the overly permissive policy that allows public access to all operations
DROP POLICY IF EXISTS "System can manage rate limits" ON public.user_rate_limits;

-- Create a proper policy for system operations (admin only)
CREATE POLICY "Admins can manage all rate limits" 
ON public.user_rate_limits 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- Create a policy for system operations (service role for edge functions)
CREATE POLICY "Service role can manage rate limits" 
ON public.user_rate_limits 
FOR ALL 
TO service_role
USING (true);

-- Ensure users can only view their own rate limit data (this policy should already exist)
-- Drop and recreate to make sure it's correct
DROP POLICY IF EXISTS "Users can view their own rate limits" ON public.user_rate_limits;

CREATE POLICY "Users can view their own rate limits" 
ON public.user_rate_limits 
FOR SELECT 
USING (auth.uid() = user_id);