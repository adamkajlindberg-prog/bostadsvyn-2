-- Add BankID verification to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bankid_verified BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bankid_verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bankid_personal_number TEXT;

-- Add moderation status to properties
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS moderation_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS moderation_notes TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES auth.users(id);
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS responsible_broker_id UUID REFERENCES public.brokers(id);

-- Add moderation check constraint
ALTER TABLE public.properties ADD CONSTRAINT check_moderation_status 
  CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged'));

-- Add ads moderation
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS moderation_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS moderation_notes TEXT;
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES auth.users(id);
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.ads ADD CONSTRAINT check_ads_moderation_status 
  CHECK (moderation_status IN ('pending', 'approved', 'rejected'));

-- Create incident reports table for user complaints
CREATE TABLE IF NOT EXISTS public.incident_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by UUID NOT NULL REFERENCES auth.users(id),
  report_type TEXT NOT NULL CHECK (report_type IN ('property', 'user', 'ad', 'other')),
  subject_id UUID,
  subject_type TEXT,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'resolved', 'dismissed')),
  assigned_to UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for incident reports
CREATE POLICY "Users can create incident reports"
  ON public.incident_reports
  FOR INSERT
  WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can view their own reports"
  ON public.incident_reports
  FOR SELECT
  USING (auth.uid() = reported_by);

CREATE POLICY "Admins can view all reports"
  ON public.incident_reports
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update reports"
  ON public.incident_reports
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create security audit log table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_category TEXT NOT NULL CHECK (event_category IN ('auth', 'data_access', 'data_modification', 'admin_action', 'security_incident')),
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  ip_address INET,
  user_agent TEXT,
  resource_type TEXT,
  resource_id UUID,
  action_performed TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs"
  ON public.security_audit_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_incident_reports_status ON public.incident_reports(status);
CREATE INDEX IF NOT EXISTS idx_incident_reports_reported_by ON public.incident_reports(reported_by);
CREATE INDEX IF NOT EXISTS idx_incident_reports_created_at ON public.incident_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_event_category ON public.security_audit_log(event_category);
CREATE INDEX IF NOT EXISTS idx_properties_moderation_status ON public.properties(moderation_status);
CREATE INDEX IF NOT EXISTS idx_ads_moderation_status ON public.ads(moderation_status);

-- Update trigger for incident reports
CREATE TRIGGER update_incident_reports_updated_at
  BEFORE UPDATE ON public.incident_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments
COMMENT ON TABLE public.incident_reports IS 'Stores user reports of problems, abuse, or disputes';
COMMENT ON TABLE public.security_audit_log IS 'Tracks all security-relevant events for compliance and incident investigation';
COMMENT ON COLUMN public.profiles.bankid_verified IS 'Indicates if user has verified their identity with BankID';
COMMENT ON COLUMN public.properties.moderation_status IS 'Status of property ad moderation (pending/approved/rejected/flagged)';
COMMENT ON COLUMN public.properties.responsible_broker_id IS 'The licensed broker responsible for this property transaction';