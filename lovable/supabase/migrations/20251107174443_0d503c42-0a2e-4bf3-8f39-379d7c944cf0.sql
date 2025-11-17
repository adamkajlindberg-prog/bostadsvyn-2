-- Create table for property valuation history
CREATE TABLE public.valuation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_data JSONB NOT NULL,
  valuation_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for market analysis history
CREATE TABLE public.market_analysis_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  market_data JSONB NOT NULL,
  analysis_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.valuation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_analysis_history ENABLE ROW LEVEL SECURITY;

-- Create policies for valuation_history
CREATE POLICY "Users can view their own valuation history"
  ON public.valuation_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own valuation history"
  ON public.valuation_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own valuation history"
  ON public.valuation_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for market_analysis_history
CREATE POLICY "Users can view their own market analysis history"
  ON public.market_analysis_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own market analysis history"
  ON public.market_analysis_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own market analysis history"
  ON public.market_analysis_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_valuation_history_user_id ON public.valuation_history(user_id);
CREATE INDEX idx_valuation_history_created_at ON public.valuation_history(created_at DESC);
CREATE INDEX idx_market_analysis_history_user_id ON public.market_analysis_history(user_id);
CREATE INDEX idx_market_analysis_history_created_at ON public.market_analysis_history(created_at DESC);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_valuation_history_updated_at
  BEFORE UPDATE ON public.valuation_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_market_analysis_history_updated_at
  BEFORE UPDATE ON public.market_analysis_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();