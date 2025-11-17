-- Identify and fix tables without RLS enabled
-- This query will show us which tables in public schema don't have RLS

DO $$ 
DECLARE
    table_record RECORD;
    table_count INTEGER := 0;
BEGIN 
    -- Check for all tables in public schema without RLS enabled
    FOR table_record IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN (
            SELECT t.tablename 
            FROM pg_tables t
            JOIN pg_class c ON c.relname = t.tablename
            JOIN pg_namespace n ON c.relnamespace = n.oid
            WHERE c.relrowsecurity = true
            AND n.nspname = 'public'
            AND t.schemaname = 'public'
        )
        -- Exclude PostGIS system tables that we can't modify
        AND tablename NOT IN ('spatial_ref_sys', 'geography_columns', 'geometry_columns')
        ORDER BY tablename
    LOOP
        table_count := table_count + 1;
        RAISE NOTICE 'Table without RLS: %.%', table_record.schemaname, table_record.tablename;
        
        -- Enable RLS on the table
        EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', table_record.schemaname, table_record.tablename);
        RAISE NOTICE 'Enabled RLS on: %.%', table_record.schemaname, table_record.tablename;
        
        -- Create appropriate policies based on table name patterns
        CASE 
            -- PostGIS related tables - allow public read access
            WHEN table_record.tablename LIKE '%spatial%' OR table_record.tablename LIKE '%geometry%' OR table_record.tablename LIKE '%geography%' THEN
                EXECUTE format('CREATE POLICY "Public read access" ON %I.%I FOR SELECT USING (true)', table_record.schemaname, table_record.tablename);
                
            -- System/reference tables - typically read-only
            WHEN table_record.tablename IN ('area_information', 'market_analytics', 'property_listings', 'property_sales_history', 'geographic_areas') THEN
                EXECUTE format('CREATE POLICY "Public read access" ON %I.%I FOR SELECT USING (true)', table_record.schemaname, table_record.tablename);
                
            -- User-specific tables - restrict to authenticated users and owners
            ELSE
                -- Default restrictive policy - no access unless specifically granted
                EXECUTE format('CREATE POLICY "Restrict access" ON %I.%I USING (false)', table_record.schemaname, table_record.tablename);
        END CASE;
        
    END LOOP;
    
    IF table_count = 0 THEN
        RAISE NOTICE 'No tables found without RLS enabled (excluding system tables)';
    ELSE
        RAISE NOTICE 'Fixed RLS on % tables', table_count;
    END IF;
END $$;