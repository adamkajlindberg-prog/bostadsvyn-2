-- Lägg till exempel-mäklare för att testa systemet
INSERT INTO public.real_estate_agents (name, company, phone, email, license_number, specialization, active_areas, years_experience, total_sales_last_year, average_rating, bio) VALUES
('Anna Karlsson', 'Svensk Fastighet AB', '08-123 45 67', 'anna.karlsson@svenskfastighet.se', 'SE12345', ARRAY['Bostadsrätter', 'Villor'], ARRAY['Stockholm', 'Täby', 'Danderyd'], 8, 45, 4.7, 'Erfaren mäklare med specialisering på Stockholmsområdet. Känd för sin professionella service och starka förhandlingsförmåga.'),

('Erik Lindberg', 'Hemfastighet Mäkleri', '08-234 56 78', 'erik.lindberg@hemfastighet.se', 'SE23456', ARRAY['Nyproduktion', 'Investering'], ARRAY['Stockholm', 'Solna', 'Sundbyberg'], 12, 62, 4.8, 'Senior mäklare med gedigen erfarenhet inom nyproduktion och investeringsfastigheter. Hjälper kunder att maximera sin investering.'),

('Maria Andersson', 'Fastighetsbyrån Stockholm', '08-345 67 89', 'maria.andersson@fastighetsbyran.se', 'SE34567', ARRAY['Bostadsrätter', 'Förstahandsköpare'], ARRAY['Stockholm', 'Södermalm', 'Östermalm'], 6, 38, 4.6, 'Specialiserad på att hjälpa förstahandsköpare navigera Stockholms fastighetsmarknad. Känd för sitt tålamod och pedagogiska förhållningssätt.'),

('Johan Petersson', 'SEB Bostad', '08-456 78 90', 'johan.petersson@sebbostad.se', 'SE45678', ARRAY['Villor', 'Radhus'], ARRAY['Täby', 'Sollentuna', 'Upplands Väsby'], 15, 28, 4.5, 'Veteran inom villförsäljning i norra Stockholm. Bred kunskap om lokala marknadsförhållanden och prissättning.'),

('Linda Gustafsson', 'Notar Mäklarhuset', '031-123 45 67', 'linda.gustafsson@notar.se', 'SE56789', ARRAY['Bostadsrätter', 'Villor'], ARRAY['Göteborg', 'Mölndal', 'Partille'], 10, 41, 4.7, 'Erfaren Göteborgsmäklare med stark lokal förankring. Excellenta resultat både vad gäller slutpriser och kundnöjdhet.');

-- Lägg till försäljningsdata för dessa mäklare
INSERT INTO public.agent_sales (agent_id, property_address, area, sale_price, list_price, sale_date, days_on_market, property_type, living_area, rooms, final_bid_count) 
SELECT 
  agents.id,
  sales.address_street || ', ' || sales.address_city,
  sales.address_city,
  sales.sale_price,
  sales.sale_price * 0.95, -- Antag att listpris var 5% lägre
  sales.sale_date,
  CASE 
    WHEN random() > 0.5 THEN 14 + floor(random() * 30)::integer -- 14-44 dagar på marknaden
    ELSE 7 + floor(random() * 14)::integer -- snabb försäljning 7-21 dagar
  END,
  sales.property_type,
  sales.living_area,
  sales.rooms,
  1 + floor(random() * 8)::integer -- 1-8 bud
FROM 
  public.property_sales_history sales,
  (SELECT id FROM public.real_estate_agents ORDER BY random() LIMIT 1) agents;

-- Uppdatera befintliga försäljningar med mäklarinfo
UPDATE public.property_sales_history 
SET 
  agent_id = (SELECT id FROM public.real_estate_agents ORDER BY random() LIMIT 1),
  listing_price = sale_price * (0.9 + random() * 0.1), -- Listpris 90-100% av slutpris
  days_on_market = 7 + floor(random() * 40)::integer,
  final_bid_count = 1 + floor(random() * 12)::integer;

-- Skapa funktion för att hitta bästa mäklare baserat på område och prestanda
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