-- Fix the admin_list_users function to resolve column ambiguity
CREATE OR REPLACE FUNCTION public.admin_list_users()
 RETURNS TABLE(id uuid, email text, role user_role, full_name text, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  -- Check if caller is admin
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') then
    raise exception 'Access denied. Admin role required.';
  end if;
  
  -- Return users with their profiles - specify table aliases to avoid ambiguity
  return query
    select u.id, u.email, p.role, p.full_name, u.created_at
    from auth.users u
    join public.profiles p on p.id = u.id
    order by u.created_at desc;
end;
$function$;