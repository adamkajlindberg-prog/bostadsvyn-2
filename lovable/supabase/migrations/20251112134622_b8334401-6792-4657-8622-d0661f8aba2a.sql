-- Add price adjustment fields to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS original_price bigint,
ADD COLUMN IF NOT EXISTS show_price_change boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS price_change_format text DEFAULT 'amount' CHECK (price_change_format IN ('amount', 'percentage'));

-- Add column comment
COMMENT ON COLUMN properties.original_price IS 'Original listing price (utgångspris) before any adjustments';
COMMENT ON COLUMN properties.show_price_change IS 'Whether to display price change in the ad';
COMMENT ON COLUMN properties.price_change_format IS 'Format to show price change: amount (kr) or percentage (%)';

-- Update existing properties to set original_price to current price if not set
UPDATE properties 
SET original_price = price 
WHERE original_price IS NULL;