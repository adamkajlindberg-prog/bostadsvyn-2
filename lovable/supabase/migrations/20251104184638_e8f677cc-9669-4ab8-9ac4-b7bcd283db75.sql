-- Add fields for bidding visibility and video URL to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS show_bidding boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS video_url text;