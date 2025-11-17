-- Make AI image editor function public by disabling JWT verification
-- This will be added to supabase/config.toml automatically

-- Update RLS policies to allow anonymous image creation
DROP POLICY IF EXISTS "Users can create AI generated images" ON ai_generated_images;

CREATE POLICY "Anyone can create AI generated images" 
ON ai_generated_images 
FOR INSERT 
WITH CHECK (true);

-- Allow anonymous analytics creation
DROP POLICY IF EXISTS "Users can create their own analytics" ON ai_editor_analytics;

CREATE POLICY "Anyone can create analytics" 
ON ai_editor_analytics 
FOR INSERT 
WITH CHECK (true);

-- Keep the existing policies for viewing/managing own content when logged in
-- This allows logged-in users to save and manage their images