-- Enable RLS on the new tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for roles table
CREATE POLICY "Admin portal users can view roles" 
ON public.roles FOR SELECT 
USING (public.has_permission('roles.read'));

CREATE POLICY "Admins can manage roles" 
ON public.roles FOR ALL 
USING (public.has_permission('roles.write'));

-- RLS policies for permissions table
CREATE POLICY "Admin portal users can view permissions" 
ON public.permissions FOR SELECT 
USING (public.has_permission('roles.read'));

CREATE POLICY "Admins can manage permissions" 
ON public.permissions FOR ALL 
USING (public.has_permission('roles.write'));

-- RLS policies for role_permissions table
CREATE POLICY "Admin portal users can view role permissions" 
ON public.role_permissions FOR SELECT 
USING (public.has_permission('roles.read'));

CREATE POLICY "Admins can manage role permissions" 
ON public.role_permissions FOR ALL 
USING (public.has_permission('roles.write'));