-- Convert existing properties to premium AI test properties
UPDATE properties 
SET 
  ad_tier = 'premium',
  title = title || ' - AI Test',
  description = COALESCE(description, 'Testfastighet för AI bildredigering.') || ' [AI-TEST - Perfekt för att testa AI bildredigeringsverktyg!]',
  images = ARRAY[
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
  ]
WHERE id IN (
  '212ec512-c55e-446f-a01e-f91bb7b4603a',
  'b4747a08-3a92-4170-807d-0e43527a7661',
  '94bd60f3-a889-439d-92cd-325b5db1ec27',
  'ca3e25e6-5957-4cc6-98d5-4f4dc3600a7f',
  'fd992a0c-cf15-4bd2-a84f-b4f278097566'
);

-- Add more test images to different properties for variety
UPDATE properties 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
  'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'
] 
WHERE id = 'b4747a08-3a92-4170-807d-0e43527a7661';

UPDATE properties 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
  'https://images.unsplash.com/photo-1600573472549-e8e1d4c34d9d?w=800'
] 
WHERE id = '94bd60f3-a889-439d-92cd-325b5db1ec27';

UPDATE properties 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'
] 
WHERE id = 'ca3e25e6-5957-4cc6-98d5-4f4dc3600a7f';

UPDATE properties 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'
] 
WHERE id = 'fd992a0c-cf15-4bd2-a84f-b4f278097566';

-- Create premium AI ads for all these properties
INSERT INTO ads (user_id, property_id, ad_tier, title, description, is_featured, priority_score)
SELECT 
  p.user_id,
  p.id,
  'premium',
  'Premium AI: ' || p.title,
  'AI-förbättrad annons med avancerade bildredigeringsverktyg och premium funktioner. Testa alla AI-funktioner!',
  true,
  CASE 
    WHEN p.id = '212ec512-c55e-446f-a01e-f91bb7b4603a' THEN 98
    WHEN p.id = 'b4747a08-3a92-4170-807d-0e43527a7661' THEN 97
    WHEN p.id = '94bd60f3-a889-439d-92cd-325b5db1ec27' THEN 96
    WHEN p.id = 'ca3e25e6-5957-4cc6-98d5-4f4dc3600a7f' THEN 95
    WHEN p.id = 'fd992a0c-cf15-4bd2-a84f-b4f278097566' THEN 94
    ELSE 90
  END
FROM properties p 
WHERE p.ad_tier = 'premium' 
AND p.title LIKE '%AI Test%';

-- Add 5 more sample images to the AI generated images table for additional testing
INSERT INTO ai_generated_images (user_id, prompt, image_type, image_url)
VALUES
(NULL, 'Modernt skandinaviskt kök med vita skåp och trädetaljer', 'property_ad', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'),
(NULL, 'Lyxigt vardagsrum med öppen spis och stora fönster', 'property_ad', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'),
(NULL, 'Elegant badrum i marmor med fristående badkar', 'property_ad', 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800'),
(NULL, 'Stilrent sovrum i naturliga toner med träinredning', 'property_ad', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'),
(NULL, 'Stor trädgård med pool och uterum för avkoppling', 'property_ad', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800');