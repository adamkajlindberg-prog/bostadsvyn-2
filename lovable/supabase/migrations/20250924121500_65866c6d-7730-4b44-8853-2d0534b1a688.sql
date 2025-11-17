-- Fix RLS disabled error for spatial_ref_sys table
-- This PostGIS system table contains spatial reference system definitions

DO $$ 
BEGIN 
    -- Enable RLS on spatial_ref_sys table (PostGIS system table)
    BEGIN
        ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;
        
        -- Create restrictive policy - only authenticated users can read spatial reference data
        CREATE POLICY "authenticated_users_spatial_ref_access" 
        ON public.spatial_ref_sys 
        FOR SELECT 
        USING (auth.uid() IS NOT NULL);
        
        RAISE NOTICE 'Successfully secured spatial_ref_sys table with RLS and authentication requirement';
        
    EXCEPTION 
        WHEN insufficient_privilege THEN
            RAISE NOTICE 'Cannot modify spatial_ref_sys - this is managed by Supabase/PostGIS';
            -- Log this as expected for system tables
        WHEN duplicate_object THEN
            RAISE NOTICE 'RLS already enabled on spatial_ref_sys';
        WHEN OTHERS THEN
            RAISE WARNING 'Error securing spatial_ref_sys: % %', SQLSTATE, SQLERRM;
    END;
    
    -- Verify all user tables have RLS enabled
    PERFORM pg_catalog.set_config('search_path', 'public', true);
    
    -- Check for any user tables without RLS
    IF EXISTS (
        SELECT 1 
        FROM pg_tables t
        LEFT JOIN pg_class c ON c.relname = t.tablename
        WHERE t.schemaname = 'public' 
        AND t.tablename NOT LIKE 'spatial_%'
        AND t.tablename NOT LIKE 'geography_%' 
        AND t.tablename NOT LIKE 'geometry_%'
        AND NOT c.relrowsecurity
    ) THEN
        RAISE WARNING 'Found user tables without RLS - this should be investigated';
    ELSE
        RAISE NOTICE 'All user tables have RLS properly enabled';
    END IF;
    
END $$;