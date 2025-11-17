-- Add 3D tour URL field to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS threed_tour_url TEXT;