-- Create a function to automatically analyze property descriptions when they are inserted or updated
CREATE OR REPLACE FUNCTION trigger_analyze_property_description()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger if description has changed or property is newly created
  IF (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.description IS DISTINCT FROM NEW.description)) THEN
    -- Only analyze if description is not empty
    IF NEW.description IS NOT NULL AND LENGTH(TRIM(NEW.description)) > 50 THEN
      -- Set ai_analyzed_at to NULL to mark it for re-analysis
      NEW.ai_analyzed_at := NULL;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for properties table
DROP TRIGGER IF EXISTS auto_analyze_property_description ON public.properties;
CREATE TRIGGER auto_analyze_property_description
  BEFORE INSERT OR UPDATE OF description
  ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION trigger_analyze_property_description();

COMMENT ON FUNCTION trigger_analyze_property_description IS 'Marks properties for AI analysis when description changes';
COMMENT ON TRIGGER auto_analyze_property_description ON public.properties IS 'Automatically marks properties for AI analysis when description is added or updated';