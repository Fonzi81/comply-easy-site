-- Create tables for analytics and monitoring

-- User sessions tracking
CREATE TABLE public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  login_time timestamp with time zone NOT NULL DEFAULT now(),
  logout_time timestamp with time zone,
  ip_address inet,
  user_agent text,
  session_duration interval GENERATED ALWAYS AS (logout_time - login_time) STORED,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User activity logs
CREATE TABLE public.user_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  resource_type text,
  resource_id uuid,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- System metrics for monitoring
CREATE TABLE public.system_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metric_unit text,
  recorded_at timestamp with time zone NOT NULL DEFAULT now(),
  details jsonb
);

-- Enable RLS on new tables
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;

-- RLS policies for admin access
CREATE POLICY "Admins can view all user sessions" 
ON public.user_sessions FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all activity logs" 
ON public.user_activity_logs FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view system metrics" 
ON public.system_metrics FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert system metrics" 
ON public.system_metrics FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

-- Users can insert their own activity logs
CREATE POLICY "Users can insert their own activity logs" 
ON public.user_activity_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own session data" 
ON public.user_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_login_time ON public.user_sessions(login_time);
CREATE INDEX idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_created_at ON public.user_activity_logs(created_at);
CREATE INDEX idx_system_metrics_metric_name ON public.system_metrics(metric_name);
CREATE INDEX idx_system_metrics_recorded_at ON public.system_metrics(recorded_at);

-- Function to get analytics data
CREATE OR REPLACE FUNCTION public.admin_get_analytics()
RETURNS TABLE(
  total_users bigint,
  active_users_7d bigint,
  active_users_30d bigint,
  total_organizations bigint,
  total_tasks bigint,
  completed_tasks bigint,
  total_evidence bigint,
  storage_used bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.profiles)::bigint as total_users,
    (SELECT COUNT(DISTINCT user_id) FROM public.user_sessions 
     WHERE login_time >= now() - interval '7 days')::bigint as active_users_7d,
    (SELECT COUNT(DISTINCT user_id) FROM public.user_sessions 
     WHERE login_time >= now() - interval '30 days')::bigint as active_users_30d,
    (SELECT COUNT(*) FROM public.organizations)::bigint as total_organizations,
    (SELECT COUNT(*) FROM public.compliance_tasks)::bigint as total_tasks,
    (SELECT COUNT(*) FROM public.compliance_tasks 
     WHERE status = 'completed')::bigint as completed_tasks,
    (SELECT COUNT(*) FROM public.evidence)::bigint as total_evidence,
    (SELECT COALESCE(SUM(file_size), 0) FROM public.evidence)::bigint as storage_used;
END;
$function$;