-- Fix security warnings from DAC 7 migration

-- Fix update_updated_at_column function to have secure search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers with the fixed function
DROP TRIGGER IF EXISTS update_dac7_landlord_info_updated_at ON public.dac7_landlord_info;
DROP TRIGGER IF EXISTS update_dac7_rental_income_updated_at ON public.dac7_rental_income;

CREATE TRIGGER update_dac7_landlord_info_updated_at
  BEFORE UPDATE ON public.dac7_landlord_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dac7_rental_income_updated_at
  BEFORE UPDATE ON public.dac7_rental_income
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment explaining the function
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Automatically updates the updated_at timestamp column. Uses SECURITY DEFINER with explicit search_path for security.';
