-- Add columns to store broker form data and seller approval info
ALTER TABLE ads 
ADD COLUMN IF NOT EXISTS broker_form_data JSONB,
ADD COLUMN IF NOT EXISTS seller_approved_at TIMESTAMPTZ;