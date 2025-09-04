-- Create the admin_get_analytics function since tables already exist
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