-- Add sample properties with correct property_type values
INSERT INTO public.properties (
  title, description, property_type, status, price, address_street, address_postal_code, address_city,
  living_area, rooms, bedrooms, bathrooms, year_built, latitude, longitude, images, user_id
) VALUES
-- Stockholm properties (using correct property_type values)
('Modern lägenhet i city', 'Vacker 3:a med balkong och öppet kök. Perfekt för paret eller småfamiljen.', 'Lägenhet', 'FOR_SALE', 4200000, 'Drottninggatan 45', '11151', 'Stockholm', 78, 3, 2, 1, 2018, 59.3293, 18.0686, ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'], 'b8c113d4-79a0-46bf-8a98-1c8b6af7e76b'),
('Lyxlägenhet på Östermalm', 'Exklusiv 4:a med högklassig standard och fantastisk utsikt över staden.', 'Lägenhet', 'FOR_SALE', 8500000, 'Östermalms Torg 12', '11442', 'Stockholm', 125, 4, 3, 2, 2020, 59.3361, 18.0889, ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'], 'b8c113d4-79a0-46bf-8a98-1c8b6af7e76b'),
('Charmig 2:a på Södermalm', 'Mysig lägenhet med kakelugn och vacker utsikt över Gamla Stan.', 'Lägenhet', 'COMING_SOON', 3800000, 'Hornsgatan 89', '11849', 'Stockholm', 68, 2, 1, 1, 1925, 59.3181, 18.0717, ARRAY['https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400'], 'b8c113d4-79a0-46bf-8a98-1c8b6af7e76b'),

-- Gothenburg properties
('Ljus lägenhet i Linnéstaden', 'Renoverad 3:a i populära Linnéstaden med nära till allt.', 'Lägenhet', 'FOR_SALE', 3200000, 'Linnégatan 28', '41304', 'Göteborg', 82, 3, 2, 1, 2019, 57.6983, 11.9539, ARRAY['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400'], 'b8c113d4-79a0-46bf-8a98-1c8b6af7e76b'),
('Modern nyproduktion', 'Helt ny lägenhet med förråd och balkong. Inflyttningsklar direkt.', 'Lägenhet', 'FOR_SALE', 4500000, 'Avenyn 67', '41136', 'Göteborg', 95, 4, 2, 2, 2024, 57.7089, 11.9746, ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'], 'b8c113d4-79a0-46bf-8a98-1c8b6af7e76b'),

-- Malmö properties  
('Lägenhet i Västra Hamnen', 'Modern lägenhet med havsutsikt och nära till stranden.', 'Lägenhet', 'FOR_SALE', 3800000, 'Västra Hamngatan 15', '21119', 'Malmö', 88, 3, 2, 2, 2021, 55.6200, 12.9700, ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'], 'b8c113d4-79a0-46bf-8a98-1c8b6af7e76b'),
('Centralt i Malmö', 'Stilren lägenhet mitt i city med närhet till tåg och shopping.', 'Lägenhet', 'COMING_SOON', 2800000, 'Stortorget 8', '21134', 'Malmö', 72, 2, 1, 1, 2017, 55.6050, 13.0038, ARRAY['https://images.unsplash.com/photo-1549517045-bc93de075e53?w=400'], 'b8c113d4-79a0-46bf-8a98-1c8b6af7e76b'),

-- House in Stockholm
('Villa i Stockholm', 'Rymlig familjevilla med stor trädgård och garage. Perfekt för familjen.', 'Villa', 'FOR_SALE', 12500000, 'Villagatan 22', '11432', 'Stockholm', 180, 6, 4, 3, 1998, 59.3500, 18.1000, ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'], 'b8c113d4-79a0-46bf-8a98-1c8b6af7e76b');