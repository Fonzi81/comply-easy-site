-- Create the admin_list_users function for secure user listing
create or replace function public.admin_list_users()
returns table (id uuid, email text, role public.user_role, full_name text, created_at timestamp with time zone)
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Check if caller is admin
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') then
    raise exception 'Access denied. Admin role required.';
  end if;
  
  -- Return users with their profiles
  return query
    select u.id, u.email, p.role, p.full_name, p.created_at
    from auth.users u
    join public.profiles p on p.id = u.id
    order by p.created_at desc;
end;
$$;

-- Create function to update user roles (admin only)
create or replace function public.update_user_role(target_user_id uuid, new_role public.user_role)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Check if caller is admin
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') then
    raise exception 'Access denied. Admin role required.';
  end if;
  
  -- Prevent admins from demoting themselves
  if target_user_id = auth.uid() and new_role = 'user' then
    raise exception 'Cannot demote yourself from admin role.';
  end if;
  
  -- Update the role
  update public.profiles 
  set role = new_role, updated_at = now()
  where id = target_user_id;
  
  return found;
end;
$$;