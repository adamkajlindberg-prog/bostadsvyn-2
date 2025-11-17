-- Add detailed property information fields to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS floor_plan_url TEXT,
ADD COLUMN IF NOT EXISTS energy_declaration_url TEXT,
ADD COLUMN IF NOT EXISTS operating_costs BIGINT,
ADD COLUMN IF NOT EXISTS kitchen_description TEXT,
ADD COLUMN IF NOT EXISTS bathroom_description TEXT,
ADD COLUMN IF NOT EXISTS property_documents JSONB DEFAULT '[]'::jsonb;

-- Add comment to explain the property_documents structure
COMMENT ON COLUMN public.properties.property_documents IS 'Array of document objects with structure: [{"name": "Besiktningsprotokoll", "url": "...", "type": "inspection", "uploaded_at": "2024-01-01"}]';

-- Create index for faster document queries
CREATE INDEX IF NOT EXISTS idx_properties_documents ON public.properties USING gin(property_documents);