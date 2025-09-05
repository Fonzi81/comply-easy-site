-- Update admin_list_users to work with platform_admin role
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE(id uuid, email text, role user_role, full_name text, created_at timestamp with time zone)
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
  
  -- Return users with their profiles
  RETURN QUERY
    SELECT 
      auth_users.id,
      auth_users.email::text,
      user_profiles.role,
      user_profiles.full_name,
      auth_users.created_at
    FROM auth.users auth_users
    INNER JOIN public.profiles user_profiles ON user_profiles.id = auth_users.id
    ORDER BY auth_users.created_at DESC;
END;
$$;