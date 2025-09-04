-- Drop and recreate the admin_list_users function with fully qualified column names
DROP FUNCTION IF EXISTS public.admin_list_users();

CREATE OR REPLACE FUNCTION public.admin_list_users()
 RETURNS TABLE(id uuid, email text, role user_role, full_name text, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  -- Check if caller is admin
  if not exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin') then
    raise exception 'Access denied. Admin role required.';
  end if;
  
  -- Return users with their profiles using fully qualified column names
  return query
    select 
      auth_users.id,
      auth_users.email,
      user_profiles.role,
      user_profiles.full_name,
      auth_users.created_at
    from auth.users auth_users
    inner join public.profiles user_profiles on user_profiles.id = auth_users.id
    order by auth_users.created_at desc;
end;
$function$;