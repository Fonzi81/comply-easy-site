-- Create a helper function that bypasses RLS for admin checks
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'::user_role
  );
$$;

-- Update admin_list_users to use the helper function
DROP FUNCTION IF EXISTS public.admin_list_users();

CREATE OR REPLACE FUNCTION public.admin_list_users()
 RETURNS TABLE(id uuid, email text, role user_role, full_name text, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  -- Check if caller is admin using the bypass function
  if not public.is_admin(auth.uid()) then
    raise exception 'Access denied. Admin role required.';
  end if;
  
  -- Return users with their profiles
  return query
    select 
      auth_users.id,
      auth_users.email::text,
      user_profiles.role,
      user_profiles.full_name,
      auth_users.created_at
    from auth.users auth_users
    inner join public.profiles user_profiles on user_profiles.id = auth_users.id
    order by auth_users.created_at desc;
end;
$function$;