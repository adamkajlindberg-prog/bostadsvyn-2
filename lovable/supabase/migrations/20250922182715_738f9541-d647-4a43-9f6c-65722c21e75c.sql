-- Remove the problematic SEB Bostad entry and update it to a proper real estate brokerage
UPDATE real_estate_agents 
SET company = 'Länsförsäkringar Fastigheter',
    email = 'johan.petersson@lansforsakringar.se',
    bio = 'Veteran inom villförsäljning i norra Stockholm. Bred kunskap om lokala marknadsförhållanden och prissättning.'
WHERE company = 'SEB Bostad';