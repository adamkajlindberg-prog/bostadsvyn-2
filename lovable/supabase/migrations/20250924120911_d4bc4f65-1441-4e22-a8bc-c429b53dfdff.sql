-- More thorough investigation of RLS issues
-- Let's check all tables and their RLS status

SELECT 
    schemaname,
    tablename,
    CASE 
        WHEN c.relrowsecurity THEN 'ENABLED'
        ELSE 'DISABLED'
    END as rls_status,
    tableowner
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE schemaname = 'public'
AND n.nspname = 'public'
ORDER BY 
    CASE WHEN c.relrowsecurity THEN 1 ELSE 0 END,
    tablename;