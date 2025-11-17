-- Add fields for Nyproduktion projects
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS nyproduktion_project_id UUID REFERENCES public.properties(id),
ADD COLUMN IF NOT EXISTS nyproduktion_total_units INTEGER DEFAULT 0;

-- Create index for faster lookups of project properties
CREATE INDEX IF NOT EXISTS idx_properties_nyproduktion_project 
ON public.properties(nyproduktion_project_id) 
WHERE nyproduktion_project_id IS NOT NULL;

-- Add comment explaining the fields
COMMENT ON COLUMN public.properties.nyproduktion_project_id IS 'For individual units: references the parent project property. For projects: NULL. This creates a parent-child relationship for nyproduktion listings.';
COMMENT ON COLUMN public.properties.nyproduktion_total_units IS 'For project properties: the total number of units in the project. For individual units: 0.';