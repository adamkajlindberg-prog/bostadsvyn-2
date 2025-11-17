-- Add AI-generated metadata columns to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS ai_extracted_features TEXT[],
ADD COLUMN IF NOT EXISTS ai_description_summary TEXT,
ADD COLUMN IF NOT EXISTS ai_keywords TEXT[],
ADD COLUMN IF NOT EXISTS ai_analyzed_at TIMESTAMP WITH TIME ZONE;

-- Add comment to explain the columns
COMMENT ON COLUMN public.properties.ai_extracted_features IS 'AI-extracted features from property description (e.g., balcony, parking, renovated, etc.)';
COMMENT ON COLUMN public.properties.ai_description_summary IS 'AI-generated summary of the property description';
COMMENT ON COLUMN public.properties.ai_keywords IS 'AI-extracted keywords for better search matching';
COMMENT ON COLUMN public.properties.ai_analyzed_at IS 'Timestamp when AI analysis was performed';

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_properties_ai_features ON public.properties USING GIN(ai_extracted_features);
CREATE INDEX IF NOT EXISTS idx_properties_ai_keywords ON public.properties USING GIN(ai_keywords);