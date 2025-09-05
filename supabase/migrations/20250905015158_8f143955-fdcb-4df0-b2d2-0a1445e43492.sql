-- Create a proper customer-only management function
CREATE OR REPLACE FUNCTION public.admin_list_customers()
RETURNS TABLE(
  id uuid, 
  email text, 
  role user_role, 
  full_name text, 
  created_at timestamp with time zone,
  subscription_status text,
  subscription_tier text,
  mrr integer,
  last_login timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if caller is admin or platform_admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin'::user_role, 'platform_admin'::user_role)
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  -- Return only customers with their subscription info
  RETURN QUERY
    SELECT 
      auth_users.id,
      auth_users.email::text,
      user_profiles.role,
      user_profiles.full_name,
      auth_users.created_at,
      COALESCE(cs.status, 'no_subscription')::text as subscription_status,
      cs.tier_id::text as subscription_tier,
      COALESCE(cs.mrr, 0) as mrr,
      us.login_time as last_login
    FROM auth.users auth_users
    INNER JOIN public.profiles user_profiles ON user_profiles.id = auth_users.id
    LEFT JOIN public.customer_subscriptions cs ON cs.customer_id = auth_users.id
    LEFT JOIN (
      SELECT DISTINCT ON (user_id) user_id, login_time 
      FROM public.user_sessions 
      ORDER BY user_id, login_time DESC
    ) us ON us.user_id = auth_users.id
    WHERE user_profiles.role IN ('customer'::user_role, 'user'::user_role)
    ORDER BY auth_users.created_at DESC;
END;
$$;