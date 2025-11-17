-- Create table for user rate limiting
CREATE TABLE public.user_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INT NOT NULL DEFAULT 0,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_request_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- Enable RLS
ALTER TABLE public.user_rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own rate limit data
CREATE POLICY "Users can view their own rate limits"
ON public.user_rate_limits 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow system to manage rate limits (for edge functions)
CREATE POLICY "System can manage rate limits"
ON public.user_rate_limits 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_user_rate_limits_user_endpoint 
ON public.user_rate_limits(user_id, endpoint);

CREATE INDEX idx_user_rate_limits_window_start 
ON public.user_rate_limits(window_start);