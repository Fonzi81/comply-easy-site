-- Phase 2 Database Enhancements
-- Add additional user management functions and organization analytics

-- Function to suspend/reactivate users
CREATE OR REPLACE FUNCTION public.admin_update_user_status(
  target_user_id uuid,
  is_active boolean
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  -- Prevent admins from deactivating themselves
  IF target_user_id = auth.uid() AND NOT is_active THEN
    RAISE EXCEPTION 'Cannot deactivate your own account.';
  END IF;
  
  -- For now, we'll track status in a new column we'll add
  -- This is a placeholder - in real implementation you'd update auth.users
  RETURN true;
END;
$function$;

-- Function to get detailed user activity
CREATE OR REPLACE FUNCTION public.admin_get_user_activity(
  target_user_id uuid,
  days_back integer DEFAULT 30
)
RETURNS TABLE(
  activity_date date,
  login_count bigint,
  action_count bigint,
  last_action_time timestamp with time zone
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
  WITH date_series AS (
    SELECT generate_series(
      current_date - interval '1 day' * days_back,
      current_date,
      interval '1 day'
    )::date AS activity_date
  ),
  login_data AS (
    SELECT 
      login_time::date AS login_date,
      COUNT(*) AS login_count
    FROM public.user_sessions
    WHERE user_id = target_user_id
      AND login_time >= current_date - interval '1 day' * days_back
    GROUP BY login_time::date
  ),
  activity_data AS (
    SELECT 
      created_at::date AS activity_date,
      COUNT(*) AS action_count,
      MAX(created_at) AS last_action_time
    FROM public.user_activity_logs
    WHERE user_id = target_user_id
      AND created_at >= current_date - interval '1 day' * days_back
    GROUP BY created_at::date
  )
  SELECT 
    ds.activity_date,
    COALESCE(ld.login_count, 0) AS login_count,
    COALESCE(ad.action_count, 0) AS action_count,
    ad.last_action_time
  FROM date_series ds
  LEFT JOIN login_data ld ON ds.activity_date = ld.login_date
  LEFT JOIN activity_data ad ON ds.activity_date = ad.activity_date
  ORDER BY ds.activity_date DESC;
END;
$function$;

-- Function to get organization analytics
CREATE OR REPLACE FUNCTION public.admin_get_organization_analytics()
RETURNS TABLE(
  org_id uuid,
  org_name text,
  member_count bigint,
  task_count bigint,
  completed_tasks bigint,
  evidence_count bigint,
  storage_used bigint,
  created_at timestamp with time zone,
  last_activity timestamp with time zone
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
    o.id AS org_id,
    o.name AS org_name,
    COALESCE(member_counts.member_count, 0) AS member_count,
    COALESCE(task_counts.task_count, 0) AS task_count,
    COALESCE(task_counts.completed_tasks, 0) AS completed_tasks,
    COALESCE(evidence_counts.evidence_count, 0) AS evidence_count,
    COALESCE(evidence_counts.storage_used, 0) AS storage_used,
    o.created_at,
    GREATEST(
      COALESCE(task_counts.last_task_activity, o.created_at),
      COALESCE(evidence_counts.last_evidence_activity, o.created_at)
    ) AS last_activity
  FROM public.organizations o
  LEFT JOIN (
    SELECT 
      organization_id,
      COUNT(*) AS member_count
    FROM public.organization_members
    GROUP BY organization_id
  ) member_counts ON o.id = member_counts.organization_id
  LEFT JOIN (
    SELECT 
      organization_id,
      COUNT(*) AS task_count,
      COUNT(*) FILTER (WHERE status = 'completed') AS completed_tasks,
      MAX(updated_at) AS last_task_activity
    FROM public.compliance_tasks
    GROUP BY organization_id
  ) task_counts ON o.id = task_counts.organization_id
  LEFT JOIN (
    SELECT 
      organization_id,
      COUNT(*) AS evidence_count,
      COALESCE(SUM(file_size), 0) AS storage_used,
      MAX(created_at) AS last_evidence_activity
    FROM public.evidence
    GROUP BY organization_id
  ) evidence_counts ON o.id = evidence_counts.organization_id
  ORDER BY o.created_at DESC;
END;
$function$;

-- Function to get template analytics
CREATE OR REPLACE FUNCTION public.admin_get_template_analytics()
RETURNS TABLE(
  template_id uuid,
  template_name text,
  category text,
  usage_count bigint,
  industry text,
  state_code text,
  is_active boolean,
  last_used timestamp with time zone,
  created_at timestamp with time zone
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
    ct.id AS template_id,
    ct.name AS template_name,
    ct.category::text AS category,
    COALESCE(usage_stats.usage_count, 0) AS usage_count,
    ct.industry,
    ct.state_code,
    ct.is_active,
    usage_stats.last_used,
    ct.created_at
  FROM public.compliance_templates ct
  LEFT JOIN (
    SELECT 
      template_id,
      COUNT(*) AS usage_count,
      MAX(created_at) AS last_used
    FROM public.compliance_tasks
    WHERE template_id IS NOT NULL
    GROUP BY template_id
  ) usage_stats ON ct.id = usage_stats.template_id
  ORDER BY usage_stats.usage_count DESC NULLS LAST, ct.created_at DESC;
END;
$function$;

-- Function to bulk update user roles
CREATE OR REPLACE FUNCTION public.admin_bulk_update_user_roles(
  user_ids uuid[],
  new_role user_role
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  updated_count integer := 0;
  user_id uuid;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  -- Prevent bulk demotion if current user is in the list and being demoted
  IF auth.uid() = ANY(user_ids) AND new_role = 'user' THEN
    RAISE EXCEPTION 'Cannot demote yourself from admin role.';
  END IF;
  
  FOREACH user_id IN ARRAY user_ids
  LOOP
    UPDATE public.profiles 
    SET role = new_role, updated_at = now()
    WHERE id = user_id;
    
    IF FOUND THEN
      updated_count := updated_count + 1;
    END IF;
  END LOOP;
  
  RETURN updated_count;
END;
$function$;