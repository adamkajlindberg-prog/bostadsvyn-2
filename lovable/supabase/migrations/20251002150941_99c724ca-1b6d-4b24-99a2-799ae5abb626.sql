-- Update the user role from buyer to broker
UPDATE user_roles 
SET role = 'broker' 
WHERE user_id = 'f6f059c6-de9a-4ac9-a8ce-5a98f661da96' 
AND role = 'buyer';