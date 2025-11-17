-- Create a trigger function to automatically assign broker role to users who sign up via broker form
CREATE OR REPLACE FUNCTION public.handle_broker_signup()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Check if this user signed up via broker form by checking their metadata
  -- We'll use a marker in the user metadata to identify broker signups
  IF (NEW.raw_user_meta_data ->> 'broker_signup')::boolean = true THEN
    -- Insert broker role for this user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'broker');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to execute after user signup
DROP TRIGGER IF EXISTS on_broker_user_created ON auth.users;
CREATE TRIGGER on_broker_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_broker_signup();