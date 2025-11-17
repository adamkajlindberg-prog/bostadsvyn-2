-- Clear existing features and add correct ones for the 3 packages
DELETE FROM ad_tier_features;

-- Grundpaket (free) features
INSERT INTO ad_tier_features (ad_tier, feature_name, feature_description, is_enabled) VALUES
('free', 'Grundläggande annons', 'Standard storlek på annons', true),
('free', 'Enkel publicering', 'Lägg ut din fastighet på plattformen', true),
('free', 'Synlighet i sökresultat', 'Din annons visas i vanliga sökningar', true);

-- Pluspaket (plus) features  
INSERT INTO ad_tier_features (ad_tier, feature_name, feature_description, is_enabled) VALUES
('plus', 'Större annons', 'Din annons får mer utrymme och syns bättre', true),
('plus', 'Prioriterad placering', 'Hamnar över Grundpaketet i publiceringslistan', true),
('plus', 'Månatlig förnyelse', 'Förnya annonsen varje månad kostnadsfritt', true),
('plus', 'Fler bilder', 'Visa upp till 15 bilder', true),
('plus', 'Utökad beskrivning', 'Mer plats för detaljerad beskrivning', true);

-- Exklusivpaket (premium) features
INSERT INTO ad_tier_features (ad_tier, feature_name, feature_description, is_enabled) VALUES
('premium', 'Störst annons', 'Maximal storlek och synlighet', true),
('premium', 'Högsta prioritet', 'Hamnar högst i publiceringslistan över alla andra', true),
('premium', 'AI-bildredigering', 'AI-verktyg för professionell bildredigering ingår', true),
('premium', 'Snabb förnyelse', 'Förnya annonsen var 3:e vecka', true),
('premium', 'Utvalda sektionen', 'Visas i "Utvalda fastigheter"', true),
('premium', 'Obegränsat med bilder', 'Visa hur många bilder du vill', true),
('premium', 'Avancerad analys', 'Detaljerad statistik och insikter', true),
('premium', 'Prioriterad support', 'Snabb och dedikerad hjälp', true);