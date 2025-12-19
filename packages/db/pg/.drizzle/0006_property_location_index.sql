-- Create immutable function for location search
CREATE OR REPLACE FUNCTION property_location_vector(
  address_street TEXT,
  address_city TEXT
) RETURNS tsvector
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT setweight(to_tsvector('swedish', address_street), 'A') ||
         setweight(to_tsvector('swedish', address_city), 'B')
$$;

-- Create the location index
CREATE INDEX property_location_index ON properties USING gin(
  property_location_vector(address_street, address_city)
);