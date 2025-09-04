-- Fix infinite recursion in profiles RLS policies
-- Drop the problematic policies
DROP POLICY IF EXISTS "profiles_admin_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_update_all" ON public.profiles;

-- Create new admin policies that use the bypass function instead of recursive queries
CREATE POLICY "profiles_admin_select_all" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "profiles_admin_update_all" 
ON public.profiles 
FOR UPDATE 
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Also ensure we can track user activity by allowing the analytics function to work
-- Update the admin_get_analytics function to use a more direct approach
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