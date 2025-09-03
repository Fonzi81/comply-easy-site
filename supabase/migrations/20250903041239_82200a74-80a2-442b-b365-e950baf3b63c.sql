-- Update the handle_new_user function to support admin setup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (user_id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  
  -- Check if this is an admin setup (first user or specifically marked as admin)
  IF (NEW.raw_user_meta_data ->> 'is_admin_setup')::boolean = true 
     OR NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    -- Give admin role for first admin or admin setup
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
    
    -- Also create organization if provided
    IF NEW.raw_user_meta_data ->> 'organization_name' IS NOT NULL THEN
      INSERT INTO public.organizations (name, created_by, email)
      VALUES (
        NEW.raw_user_meta_data ->> 'organization_name',
        NEW.id,
        NEW.email
      );
      
      -- Add user to the organization as admin
      INSERT INTO public.organization_members (organization_id, user_id, role)
      SELECT o.id, NEW.id, 'admin'::app_role
      FROM public.organizations o
      WHERE o.created_by = NEW.id;
    END IF;
  ELSE
    -- Give default user role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  RETURN NEW;
END;
$$;