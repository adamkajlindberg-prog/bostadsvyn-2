-- Fix the specific RLS issue with spatial_ref_sys table
-- This is a PostGIS system table for spatial reference systems

DO $$ 
BEGIN 
    -- Try to enable RLS on spatial_ref_sys table
    -- This table contains spatial reference system definitions and is safe to be publicly readable
    BEGIN
        ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Successfully enabled RLS on spatial_ref_sys';
        
        -- Create a policy to allow public read access since this is reference data
        CREATE POLICY "Public read access to spatial reference systems" 
        ON public.spatial_ref_sys 
        FOR SELECT 
        USING (true);
        
        RAISE NOTICE 'Created public read policy for spatial_ref_sys';
        
    EXCEPTION 
        WHEN insufficient_privilege THEN
            RAISE NOTICE 'Insufficient privileges to modify spatial_ref_sys table - this is a system table managed by Supabase';
        WHEN OTHERS THEN
            RAISE NOTICE 'Could not modify spatial_ref_sys: % %', SQLSTATE, SQLERRM;
    END;
    
END $$;

-- Also check if there are any views that might need RLS
SELECT 
    schemaname,
    viewname,
    viewowner
FROM pg_views 
WHERE schemaname = 'public'
ORDER BY viewname;