-- Fix security warnings from the linter

-- 1. Fix the function search path issue for the newly created function
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
SET search_path = public
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

-- 2. Ensure RLS is enabled on any tables that might be missing it
-- (Check common system tables that might be missing RLS)

-- Check if spatial_ref_sys table exists and enable RLS if needed (PostGIS table)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'spatial_ref_sys') THEN
        ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;
        -- Create a policy to allow read access to spatial reference systems
        CREATE POLICY "Anyone can read spatial reference systems" ON public.spatial_ref_sys FOR SELECT USING (true);
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- Table might already have RLS enabled or policy might exist
    NULL;
END $$;