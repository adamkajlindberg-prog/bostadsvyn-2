-- Add company role to app_role enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'buyer', 'seller', 'broker', 'company');
  ELSE
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'company';
  END IF;
END $$;

-- Add company fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS org_number TEXT;