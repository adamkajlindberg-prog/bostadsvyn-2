-- Fixa search_path för funktion
CREATE OR REPLACE FUNCTION public.get_top_agents_for_area(
  search_area TEXT,
  property_type_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  agent_name TEXT,
  company TEXT,
  phone TEXT,
  email TEXT,
  years_experience INTEGER,
  total_sales INTEGER,
  avg_rating DECIMAL,
  recent_sales_count BIGINT,
  avg_days_on_market DECIMAL,
  avg_final_bids DECIMAL,
  success_rate_vs_list_price DECIMAL
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH agent_stats AS (
    SELECT 
      ra.id,
      ra.name,
      ra.company,
      ra.phone,
      ra.email,
      ra.years_experience,
      ra.total_sales_last_year,
      ra.average_rating,
      COUNT(s.id) as recent_sales,
      AVG(s.days_on_market) as avg_days,
      AVG(s.final_bid_count) as avg_bids,
      AVG(CASE 
        WHEN s.list_price > 0 THEN (s.sale_price::decimal / s.list_price::decimal) 
        ELSE 1.0 
      END) as success_rate
    FROM public.real_estate_agents ra
    LEFT JOIN public.agent_sales s ON ra.id = s.agent_id
      AND s.sale_date >= CURRENT_DATE - INTERVAL '2 years'
      AND (property_type_filter IS NULL OR s.property_type = property_type_filter)
      AND s.area ILIKE '%' || search_area || '%'
    WHERE search_area = ANY(ra.active_areas) OR ra.active_areas @> ARRAY[search_area]
    GROUP BY ra.id, ra.name, ra.company, ra.phone, ra.email, ra.years_experience, ra.total_sales_last_year, ra.average_rating
  )
  SELECT 
    ast.name::TEXT,
    ast.company::TEXT,
    ast.phone::TEXT,
    ast.email::TEXT,
    ast.years_experience,
    ast.total_sales_last_year,
    ast.average_rating,
    ast.recent_sales,
    ROUND(ast.avg_days, 1),
    ROUND(ast.avg_bids, 1),
    ROUND(ast.success_rate * 100, 1)
  FROM agent_stats ast
  ORDER BY 
    ast.average_rating DESC,
    ast.success_rate DESC,
    ast.recent_sales DESC
  LIMIT limit_count;
END;
$$;