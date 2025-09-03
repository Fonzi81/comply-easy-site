-- Update the handle_new_user function to only assign 'user' role by default
-- Remove admin setup logic from signup process
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (user_id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  
  -- Always give default user role for new signups
  -- Admins must be created manually in Supabase backend
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Create organization if provided (for regular business users)
  IF NEW.raw_user_meta_data ->> 'organization_name' IS NOT NULL THEN
    INSERT INTO public.organizations (name, created_by, email)
    VALUES (
      NEW.raw_user_meta_data ->> 'organization_name',
      NEW.id,
      NEW.email
    );
    
    -- Add user to the organization as regular user
    INSERT INTO public.organization_members (organization_id, user_id, role)
    SELECT o.id, NEW.id, 'user'::app_role
    FROM public.organizations o
    WHERE o.created_by = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$function$;