-- Create user search history table
CREATE TABLE public.user_search_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  search_query text,
  search_filters jsonb DEFAULT '{}'::jsonb,
  property_type text,
  price_range text,
  location text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_search_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own search history" 
ON public.user_search_history 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_user_search_history_user_id ON public.user_search_history(user_id);
CREATE INDEX idx_user_search_history_created_at ON public.user_search_history(created_at DESC);