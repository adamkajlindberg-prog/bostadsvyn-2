-- Add last_renewed_at column to properties table to track ad renewals
ALTER TABLE public.properties 
ADD COLUMN last_renewed_at timestamp with time zone;

-- Add index for better query performance when sorting by renewal date
CREATE INDEX idx_properties_last_renewed_at ON public.properties(last_renewed_at DESC NULLS LAST);