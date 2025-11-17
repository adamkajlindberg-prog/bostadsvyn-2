-- First, delete duplicate chat sessions keeping only the most recent one per user
WITH ranked_sessions AS (
  SELECT id, user_id,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC) as rn
  FROM chat_sessions
  WHERE user_id IS NOT NULL
)
DELETE FROM chat_sessions 
WHERE id IN (
  SELECT id FROM ranked_sessions WHERE rn > 1
);

-- Now add the unique constraint
ALTER TABLE chat_sessions 
ADD CONSTRAINT chat_sessions_user_id_unique UNIQUE (user_id);