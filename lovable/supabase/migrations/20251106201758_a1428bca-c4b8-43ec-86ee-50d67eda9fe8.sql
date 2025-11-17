-- Add additional qualification fields to property_final_price_watchers table
ALTER TABLE property_final_price_watchers 
ADD COLUMN reason_for_interest text,
ADD COLUMN planning_to_sell boolean DEFAULT false,
ADD COLUMN estimated_sale_timeframe text,
ADD COLUMN current_living_situation text,
ADD COLUMN budget_range text;