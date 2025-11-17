-- Add viewing_times column to properties table for showing scheduled property viewings
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS viewing_times jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.properties.viewing_times IS 'Array of viewing times with date, time, and status. Format: [{"date": "2025-11-15", "time": "14:00-15:00", "status": "scheduled", "spots_available": 10}]';