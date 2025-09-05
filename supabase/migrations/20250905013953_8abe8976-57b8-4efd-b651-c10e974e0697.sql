-- Fix admin functions to work with platform_admin role
-- Update is_admin function to include platform_admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role IN ('admin'::user_role, 'platform_admin'::user_role)
  );
$$;

-- Update has_permission function to work with platform_admin role
CREATE OR REPLACE FUNCTION public.has_permission(perm text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  uid uuid := auth.uid();
  role_key text;
  rid uuid;
BEGIN
  IF uid IS NULL THEN RETURN false; END IF;
  
  SELECT role::text INTO role_key FROM public.profiles WHERE id = uid;
  IF role_key IS NULL THEN RETURN false; END IF;

  -- Platform admin has all permissions
  IF role_key = 'platform_admin' THEN RETURN true; END IF;

  SELECT id INTO rid FROM public.roles WHERE key = role_key;
  
  IF rid IS NULL THEN
    -- fallback: admin enum grants everything
    IF role_key = 'admin' THEN RETURN true; ELSE RETURN false; END IF;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.role_permissions rp
    JOIN public.permissions pr ON pr.id = rp.permission_id
    WHERE rp.role_id = rid AND pr.key = perm
  );
END;
$$;

-- Insert default roles and permissions for the system
INSERT INTO public.roles (key, label) VALUES
('platform_admin', 'Platform Administrator'),
('admin', 'Administrator'),
('user', 'User')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.permissions (key, description) VALUES
('admin.portal.access', 'Access admin portal'),
('roles.read', 'View roles and permissions'),
('roles.write', 'Manage roles and permissions'),
('users.read', 'View users'),
('users.write', 'Manage users'),
('organizations.read', 'View organizations'),
('organizations.write', 'Manage organizations'),
('templates.read', 'View templates'),
('templates.write', 'Manage templates'),
('analytics.read', 'View analytics'),
('system.read', 'View system metrics')
ON CONFLICT (key) DO NOTHING;

-- Grant all permissions to platform_admin and admin roles
DO $$
DECLARE
    admin_role_id uuid;
    platform_admin_role_id uuid;
    perm_id uuid;
BEGIN
    -- Get role IDs
    SELECT id INTO admin_role_id FROM public.roles WHERE key = 'admin';
    SELECT id INTO platform_admin_role_id FROM public.roles WHERE key = 'platform_admin';
    
    -- Grant all permissions to both admin roles
    FOR perm_id IN (SELECT id FROM public.permissions) LOOP
        INSERT INTO public.role_permissions (role_id, permission_id) 
        VALUES (admin_role_id, perm_id)
        ON CONFLICT DO NOTHING;
        
        INSERT INTO public.role_permissions (role_id, permission_id) 
        VALUES (platform_admin_role_id, perm_id)
        ON CONFLICT DO NOTHING;
    END LOOP;
END $$;