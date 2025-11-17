-- Update subscription tier enum to include pro_plus
ALTER TYPE subscription_tier ADD VALUE IF NOT EXISTS 'pro_plus';