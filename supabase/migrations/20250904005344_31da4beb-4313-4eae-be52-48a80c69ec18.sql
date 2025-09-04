-- Create missing admin profile for complyeasyau@gmail.com
INSERT INTO public.profiles (id, role, full_name, created_at, updated_at)
SELECT 
  au.id,
  'admin'::user_role,
  'Admin User',
  now(),
  now()
FROM auth.users au 
WHERE au.email = 'complyeasyau@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = au.id
  );