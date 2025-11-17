-- Add 'company' value to user_role enum if it doesn't exist
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'company';