-- Fix security issue: Remove public access to sensitive real estate agent data
-- Step 1: Drop the existing public access policy that exposes sensitive data
DROP POLICY "Anyone can view real estate agents" ON public.real_estate_agents;

-- Step 2: Create new policy for authenticated users to view all agent data
CREATE POLICY "Authenticated users can view real estate agents" 
ON public.real_estate_agents 
FOR SELECT 
TO authenticated
USING (true);

-- Step 3: Create a function that returns only public agent information
CREATE OR REPLACE FUNCTION public.get_public_agents()
RETURNS TABLE (
    id uuid,
    name text,
    company text,
    bio text,
    website_url text,
    profile_image_url text,
    specialization text[],
    active_areas text[],
    years_experience integer,
    average_rating numeric,
    total_sales_last_year integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT 
        id,
        name,
        company,
        bio,
        website_url,
        profile_image_url,
        specialization,
        active_areas,
        years_experience,
        average_rating,
        total_sales_last_year,
        created_at,
        updated_at
    FROM public.real_estate_agents
    ORDER BY average_rating DESC, total_sales_last_year DESC;
$$;

-- Grant execute permission to anonymous users for the function
GRANT EXECUTE ON FUNCTION public.get_public_agents() TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_agents() TO authenticated;