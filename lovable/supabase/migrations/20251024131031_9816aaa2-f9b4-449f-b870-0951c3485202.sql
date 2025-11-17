-- Add bio field to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create broker_profiles storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('broker-profiles', 'broker-profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for broker profile pictures
CREATE POLICY "Brokers can upload their own profile picture"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'broker-profiles' 
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'broker'
  )
);

CREATE POLICY "Brokers can update their own profile picture"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'broker-profiles'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'broker'
  )
);

CREATE POLICY "Brokers can delete their own profile picture"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'broker-profiles'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'broker'
  )
);

CREATE POLICY "Profile pictures are publicly viewable"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'broker-profiles');