-- Populate geographic_areas with Swedish locations
INSERT INTO public.geographic_areas (name, area_type, center_lat, center_lng, coordinates, population) VALUES
-- Major cities (municipalities)
('Stockholm', 'municipality', 59.3293, 18.0686, '{"type": "Point", "coordinates": [18.0686, 59.3293]}', 975551),
('Göteborg', 'municipality', 57.7089, 11.9746, '{"type": "Point", "coordinates": [11.9746, 57.7089]}', 583056),
('Malmö', 'municipality', 55.6050, 13.0038, '{"type": "Point", "coordinates": [13.0038, 55.6050]}', 347949),
('Uppsala', 'municipality', 59.8586, 17.6389, '{"type": "Point", "coordinates": [17.6389, 59.8586]}', 230767),
('Linköping', 'municipality', 58.4108, 15.6214, '{"type": "Point", "coordinates": [15.6214, 58.4108]}', 165269),
('Västerås', 'municipality', 59.6162, 16.5528, '{"type": "Point", "coordinates": [16.5528, 59.6162]}', 154049),
('Örebro', 'municipality', 59.2741, 15.2066, '{"type": "Point", "coordinates": [15.2066, 59.2741]}', 156381),
('Norrköping', 'municipality', 58.5877, 16.1924, '{"type": "Point", "coordinates": [16.1924, 58.5877]}', 143171),

-- Stockholm districts
('Södermalm', 'district', 59.3181, 18.0717, '{"type": "Point", "coordinates": [18.0717, 59.3181]}', 50000),
('Östermalm', 'district', 59.3361, 18.0889, '{"type": "Point", "coordinates": [18.0889, 59.3361]}', 45000),
('Vasastan', 'district', 59.3436, 18.0531, '{"type": "Point", "coordinates": [18.0531, 59.3436]}', 42000),
('Norrmalm', 'district', 59.3326, 18.0649, '{"type": "Point", "coordinates": [18.0649, 59.3326]}', 35000),
('Gamla Stan', 'district', 59.3255, 18.0711, '{"type": "Point", "coordinates": [18.0711, 59.3255]}', 3000),

-- Gothenburg districts  
('Linnéstaden', 'district', 57.6983, 11.9539, '{"type": "Point", "coordinates": [11.9539, 57.6983]}', 25000),
('Majorna', 'district', 57.6889, 11.9283, '{"type": "Point", "coordinates": [11.9283, 57.6889]}', 22000),
('Hisingen', 'district', 57.7400, 11.9700, '{"type": "Point", "coordinates": [11.9700, 57.7400]}', 130000),

-- Malmö districts
('Västra Hamnen', 'district', 55.6200, 12.9700, '{"type": "Point", "coordinates": [12.9700, 55.6200]}', 15000),
('Limhamn', 'district', 55.5800, 12.9200, '{"type": "Point", "coordinates": [12.9200, 55.5800]}', 25000);

-- Add some property sales history data
INSERT INTO public.property_sales_history (
  address_street, address_city, address_postal_code, property_type, 
  sale_price, sale_date, living_area, rooms, price_per_sqm, 
  latitude, longitude
) VALUES
-- Stockholm sales
('Drottninggatan 12', 'Stockholm', '11151', 'apartment', 4500000, '2024-01-15', 75, 3, 60000, 59.3293, 18.0686),
('Sveavägen 45', 'Stockholm', '11134', 'apartment', 6200000, '2024-02-20', 95, 4, 65263, 59.3436, 18.0531),
('Östermalms Torg 8', 'Stockholm', '11442', 'apartment', 8500000, '2024-03-10', 120, 5, 70833, 59.3361, 18.0889),
('Hornsgatan 67', 'Stockholm', '11849', 'apartment', 3800000, '2024-01-25', 65, 2, 58462, 59.3181, 18.0717),

-- Gothenburg sales
('Kungsgatan 22', 'Göteborg', '41115', 'apartment', 3200000, '2024-02-05', 80, 3, 40000, 57.7089, 11.9746),
('Linnégatan 15', 'Göteborg', '41304', 'apartment', 2800000, '2024-01-30', 70, 2, 40000, 57.6983, 11.9539),
('Avenyn 35', 'Göteborg', '41136', 'apartment', 4500000, '2024-03-15', 100, 4, 45000, 57.7089, 11.9746),

-- Malmö sales
('Stortorget 5', 'Malmö', '21134', 'apartment', 2500000, '2024-02-10', 75, 3, 33333, 55.6050, 13.0038),
('Västra Hamngatan 12', 'Malmö', '21119', 'apartment', 3800000, '2024-01-20', 85, 3, 44706, 55.6200, 12.9700),

-- Uppsala sales
('Stora Torget 8', 'Uppsala', '75311', 'apartment', 2800000, '2024-02-28', 85, 3, 32941, 59.8586, 17.6389),

-- House sales
('Villagatan 15', 'Stockholm', '11432', 'house', 12500000, '2024-01-10', 180, 6, 69444, 59.3500, 18.1000),
('Residensgatan 25', 'Göteborg', '41139', 'house', 8500000, '2024-02-15', 160, 5, 53125, 57.7200, 12.0000),
('Slottsgatan 8', 'Malmö', '21134', 'house', 6200000, '2024-03-05', 140, 4, 44286, 55.6100, 13.0100);