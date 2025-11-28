-- Add broker roles to brokers table
ALTER TABLE public.brokers 
ADD COLUMN IF NOT EXISTS is_office_owner boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_assistant boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_broker boolean DEFAULT false;

-- Create office team members table for managing access
CREATE TABLE IF NOT EXISTS public.office_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id uuid NOT NULL REFERENCES public.broker_offices(id) ON DELETE CASCADE,
  broker_id uuid NOT NULL REFERENCES public.brokers(id) ON DELETE CASCADE,
  added_by uuid NOT NULL REFERENCES public.brokers(id) ON DELETE CASCADE,
  has_statistics_access boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(office_id, broker_id)
);

-- Enable RLS
ALTER TABLE public.office_team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for office_team_members
CREATE POLICY "Office owners can view their team members"
  ON public.office_team_members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.brokers
      WHERE brokers.id = office_team_members.added_by
      AND brokers.user_id = auth.uid()
      AND brokers.is_office_owner = true
    )
    OR
    EXISTS (
      SELECT 1 FROM public.brokers
      WHERE brokers.id = office_team_members.broker_id
      AND brokers.user_id = auth.uid()
    )
  );

CREATE POLICY "Office owners can insert team members"
  ON public.office_team_members
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.brokers
      WHERE brokers.id = office_team_members.added_by
      AND brokers.user_id = auth.uid()
      AND brokers.is_office_owner = true
    )
  );

CREATE POLICY "Office owners can update their team members"
  ON public.office_team_members
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.brokers
      WHERE brokers.id = office_team_members.added_by
      AND brokers.user_id = auth.uid()
      AND brokers.is_office_owner = true
    )
  );

CREATE POLICY "Office owners can delete team members"
  ON public.office_team_members
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.brokers
      WHERE brokers.id = office_team_members.added_by
      AND brokers.user_id = auth.uid()
      AND brokers.is_office_owner = true
    )
  );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_office_team_members_office_id ON public.office_team_members(office_id);
CREATE INDEX IF NOT EXISTS idx_office_team_members_broker_id ON public.office_team_members(broker_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_office_team_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_office_team_members_timestamp
  BEFORE UPDATE ON public.office_team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_office_team_members_updated_at();