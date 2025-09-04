-- ===== Enhanced Admin Portal Schema =====

-- More granular permissions system
CREATE TABLE IF NOT EXISTS public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,        -- e.g. 'admin', 'manager', 'user'
  label text NOT NULL,             -- human readable
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,        -- e.g. 'admin.portal.access', 'users.read', 'users.write'
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id uuid REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Enhanced permission checking function
CREATE OR REPLACE FUNCTION public.has_permission(perm text)
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public 
AS $$
DECLARE
  uid uuid := auth.uid();
  role_key text;
  rid uuid;
BEGIN
  IF uid IS NULL THEN RETURN false; END IF;
  
  SELECT role::text INTO role_key FROM public.profiles WHERE id = uid;
  IF role_key IS NULL THEN RETURN false; END IF;

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

-- Enhanced admin functions
CREATE OR REPLACE FUNCTION public.admin_get_roles()
RETURNS TABLE(id uuid, key text, label text, permission_count bigint)
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public 
AS $$
BEGIN
  IF NOT public.has_permission('admin.portal.access') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN QUERY
  SELECT 
    r.id, 
    r.key, 
    r.label,
    COUNT(rp.permission_id) as permission_count
  FROM public.roles r
  LEFT JOIN public.role_permissions rp ON r.id = rp.role_id
  GROUP BY r.id, r.key, r.label
  ORDER BY r.key;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_permissions()
RETURNS TABLE(id uuid, key text, description text)
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public 
AS $$
BEGIN
  IF NOT public.has_permission('roles.read') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN QUERY
  SELECT p.id, p.key, p.description
  FROM public.permissions p
  ORDER BY p.key;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_assign_permission(role_key text, perm_key text)
RETURNS boolean
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public 
AS $$
DECLARE
  rid uuid;
  pid uuid;
BEGIN
  IF NOT public.has_permission('roles.write') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT id INTO rid FROM public.roles WHERE key = role_key;
  SELECT id INTO pid FROM public.permissions WHERE key = perm_key;
  
  IF rid IS NULL OR pid IS NULL THEN
    RETURN false;
  END IF;

  INSERT INTO public.role_permissions (role_id, permission_id) 
  VALUES (rid, pid)
  ON CONFLICT DO NOTHING;
  
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_revoke_permission(role_key text, perm_key text)
RETURNS boolean
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public 
AS $$
DECLARE
  rid uuid;
  pid uuid;
BEGIN
  IF NOT public.has_permission('roles.write') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT id INTO rid FROM public.roles WHERE key = role_key;
  SELECT id INTO pid FROM public.permissions WHERE key = perm_key;
  
  IF rid IS NULL OR pid IS NULL THEN
    RETURN false;
  END IF;

  DELETE FROM public.role_permissions 
  WHERE role_id = rid AND permission_id = pid;
  
  RETURN true;
END;
$$;

-- ===== Seed base roles/permissions =====
INSERT INTO public.roles (key, label) VALUES
  ('admin','Administrator'),
  ('manager','Manager'),
  ('user','User')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.permissions (key, description) VALUES
  ('admin.portal.access','Access the Admin Portal'),
  ('users.read','List users and view roles'),
  ('users.write','Promote/demote users'),
  ('roles.read','List roles and permissions'),
  ('roles.write','Edit role-permission mappings'),
  ('tasks.read','View compliance tasks'),
  ('tasks.write','Create and edit compliance tasks'),
  ('templates.read','View compliance templates'),
  ('templates.write','Create and edit compliance templates'),
  ('evidence.read','View evidence files'),
  ('evidence.write','Upload and manage evidence'),
  ('audit.read','View audit reports'),
  ('audit.write','Generate audit reports')
ON CONFLICT (key) DO NOTHING;

-- Map admin -> all permissions
INSERT INTO public.role_permissions(role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.key = 'admin'
ON CONFLICT DO NOTHING;

-- Map manager -> read-only + some write perms
INSERT INTO public.role_permissions(role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p ON p.key IN (
  'admin.portal.access','users.read','roles.read','tasks.read','tasks.write',
  'templates.read','evidence.read','evidence.write','audit.read'
)
WHERE r.key = 'manager'
ON CONFLICT DO NOTHING;

-- Map user -> basic read permissions
INSERT INTO public.role_permissions(role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p ON p.key IN (
  'tasks.read','templates.read','evidence.read','evidence.write'
)
WHERE r.key = 'user'
ON CONFLICT DO NOTHING;