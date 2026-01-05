-- Create immutable function for property search
CREATE OR REPLACE FUNCTION property_search_vector(
  title TEXT,
  description TEXT,
  property_type VARCHAR,
  status VARCHAR,
  price BIGINT,
  address_street TEXT,
  address_city TEXT,
  living_area INTEGER,
  plot_area INTEGER,
  rooms INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  year_built INTEGER,
  monthly_fee INTEGER,
  features TEXT[],
  operating_costs INTEGER,
  kitchen_description TEXT,
  bathroom_description TEXT,
  ad_tier VARCHAR
) RETURNS tsvector
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT to_tsvector('swedish', 
    title || ' ' || 
    COALESCE(description, '') || ' ' || 
    property_type || ' ' || 
    status || ' ' ||
    price::text || ' ' ||
    address_street || ' ' ||
    address_city || ' ' ||
    COALESCE(living_area::text, '') || ' ' ||
    COALESCE(plot_area::text, '') || ' ' ||
    COALESCE(rooms::text, '') || ' ' ||
    COALESCE(bedrooms::text, '') || ' ' ||
    COALESCE(bathrooms::text, '') || ' ' ||
    COALESCE(year_built::text, '') || ' ' ||
    COALESCE(monthly_fee::text, '') || ' ' ||
    COALESCE(array_to_string(features, ' '), '') || ' ' ||
    COALESCE(operating_costs::text, '') || ' ' ||
    COALESCE(kitchen_description, '') || ' ' ||
    COALESCE(bathroom_description, '') || ' ' ||
    ad_tier
  )
$$;

-- Create the GIN index using the immutable function
CREATE INDEX property_search_index ON properties USING gin(
  property_search_vector(
    title, description, property_type, status, price,
    address_street, address_city, living_area, plot_area,
    rooms, bedrooms, bathrooms, year_built, monthly_fee,
    features, operating_costs, kitchen_description,
    bathroom_description, ad_tier
  )
);