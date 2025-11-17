-- Create table for user AI edited images
CREATE TABLE public.user_ai_edits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_id UUID,
  property_title TEXT,
  original_image_url TEXT NOT NULL,
  edited_image_url TEXT NOT NULL,
  edit_prompt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  edit_type TEXT NOT NULL DEFAULT 'renovation'
);

-- Enable Row Level Security
ALTER TABLE public.user_ai_edits ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own AI edits" 
ON public.user_ai_edits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI edits" 
ON public.user_ai_edits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI edits" 
ON public.user_ai_edits 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI edits" 
ON public.user_ai_edits 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_user_ai_edits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_ai_edits_updated_at
BEFORE UPDATE ON public.user_ai_edits
FOR EACH ROW
EXECUTE FUNCTION public.update_user_ai_edits_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_user_ai_edits_user_id ON public.user_ai_edits(user_id);
CREATE INDEX idx_user_ai_edits_property_id ON public.user_ai_edits(property_id);
CREATE INDEX idx_user_ai_edits_created_at ON public.user_ai_edits(created_at DESC);
CREATE INDEX idx_user_ai_edits_is_favorite ON public.user_ai_edits(user_id, is_favorite) WHERE is_favorite = true;