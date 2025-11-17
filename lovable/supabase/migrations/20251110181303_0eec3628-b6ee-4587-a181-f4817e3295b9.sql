-- Add is_nyproduktion column to properties table
ALTER TABLE public.properties 
ADD COLUMN is_nyproduktion BOOLEAN DEFAULT FALSE;

-- Add comment to explain the column
COMMENT ON COLUMN public.properties.is_nyproduktion IS 'Indicates if this property is part of new construction/development project';

-- Create index for better query performance on nyproduktion properties
CREATE INDEX idx_properties_nyproduktion ON public.properties(is_nyproduktion) WHERE is_nyproduktion = TRUE;