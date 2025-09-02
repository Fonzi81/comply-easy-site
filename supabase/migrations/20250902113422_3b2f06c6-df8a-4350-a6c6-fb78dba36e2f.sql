-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'user');

-- Create compliance category enum
CREATE TYPE public.compliance_category AS ENUM ('food_safety', 'whs', 'fire_safety', 'test_tag');

-- Create task status enum
CREATE TYPE public.task_status AS ENUM ('pending', 'in_progress', 'completed', 'overdue');

-- Create evidence type enum
CREATE TYPE public.evidence_type AS ENUM ('document', 'image', 'video', 'other');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- Create user roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Create organizations/sites table
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    industry TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user organization memberships
CREATE TABLE public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(organization_id, user_id)
);

-- Create compliance templates table
CREATE TABLE public.compliance_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category compliance_category NOT NULL,
    description TEXT,
    state_code TEXT, -- QLD, NSW, etc.
    industry TEXT,
    version TEXT,
    recurrence_days INTEGER, -- How often task repeats
    evidence_required BOOLEAN DEFAULT false,
    guidance_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create compliance tasks table
CREATE TABLE public.compliance_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.compliance_templates(id),
    title TEXT NOT NULL,
    description TEXT,
    category compliance_category NOT NULL,
    status task_status DEFAULT 'pending',
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_date TIMESTAMP WITH TIME ZONE,
    assigned_to UUID REFERENCES auth.users(id),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    evidence_required BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 1, -- 1=low, 2=medium, 3=high
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create evidence table
CREATE TABLE public.evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.compliance_tasks(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    file_type TEXT,
    evidence_type evidence_type DEFAULT 'document',
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create audit packs table
CREATE TABLE public.audit_packs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    date_from TIMESTAMP WITH TIME ZONE NOT NULL,
    date_to TIMESTAMP WITH TIME ZONE NOT NULL,
    generated_by UUID NOT NULL REFERENCES auth.users(id),
    file_path TEXT, -- Path to generated PDF
    status TEXT DEFAULT 'generating', -- generating, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_packs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check organization membership
CREATE OR REPLACE FUNCTION public.is_organization_member(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE user_id = _user_id
      AND organization_id = _org_id
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for organizations
CREATE POLICY "Members can view their organizations" 
ON public.organizations 
FOR SELECT 
USING (
  auth.uid() = created_by OR 
  public.is_organization_member(auth.uid(), id)
);

CREATE POLICY "Users can create organizations" 
ON public.organizations 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Organization creators and admins can update" 
ON public.organizations 
FOR UPDATE 
USING (
  auth.uid() = created_by OR 
  public.has_role(auth.uid(), 'admin')
);

-- RLS Policies for organization_members
CREATE POLICY "Members can view organization memberships" 
ON public.organization_members 
FOR SELECT 
USING (public.is_organization_member(auth.uid(), organization_id));

CREATE POLICY "Organization creators can manage memberships" 
ON public.organization_members 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = organization_id 
    AND created_by = auth.uid()
  )
);

-- RLS Policies for compliance_templates
CREATE POLICY "Templates are publicly viewable" 
ON public.compliance_templates 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage templates" 
ON public.compliance_templates 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for compliance_tasks
CREATE POLICY "Organization members can view tasks" 
ON public.compliance_tasks 
FOR SELECT 
USING (public.is_organization_member(auth.uid(), organization_id));

CREATE POLICY "Organization members can create tasks" 
ON public.compliance_tasks 
FOR INSERT 
WITH CHECK (
  public.is_organization_member(auth.uid(), organization_id) AND
  auth.uid() = created_by
);

CREATE POLICY "Assigned users and creators can update tasks" 
ON public.compliance_tasks 
FOR UPDATE 
USING (
  public.is_organization_member(auth.uid(), organization_id) AND
  (auth.uid() = created_by OR auth.uid() = assigned_to)
);

-- RLS Policies for evidence
CREATE POLICY "Organization members can view evidence" 
ON public.evidence 
FOR SELECT 
USING (public.is_organization_member(auth.uid(), organization_id));

CREATE POLICY "Organization members can upload evidence" 
ON public.evidence 
FOR INSERT 
WITH CHECK (
  public.is_organization_member(auth.uid(), organization_id) AND
  auth.uid() = uploaded_by
);

-- RLS Policies for audit_packs
CREATE POLICY "Organization members can view audit packs" 
ON public.audit_packs 
FOR SELECT 
USING (public.is_organization_member(auth.uid(), organization_id));

CREATE POLICY "Organization members can generate audit packs" 
ON public.audit_packs 
FOR INSERT 
WITH CHECK (
  public.is_organization_member(auth.uid(), organization_id) AND
  auth.uid() = generated_by
);

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compliance_templates_updated_at
    BEFORE UPDATE ON public.compliance_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compliance_tasks_updated_at
    BEFORE UPDATE ON public.compliance_tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  
  -- Give default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default compliance templates
INSERT INTO public.compliance_templates (name, category, description, state_code, industry, version, recurrence_days, evidence_required, guidance_url) VALUES
('Food Safety Plan Review', 'food_safety', 'Annual review of food safety plan compliance', 'QLD', 'Food Service', '3.2.2A', 365, true, 'https://www.foodstandards.gov.au/code/Pages/default.aspx'),
('Temperature Monitoring', 'food_safety', 'Daily temperature checks for refrigeration units', 'QLD', 'Food Service', '3.2.2A', 1, true, null),
('Cleaning Schedule Verification', 'food_safety', 'Weekly verification of cleaning schedules', 'QLD', 'Food Service', '3.2.2A', 7, true, null),
('WHS Risk Assessment', 'whs', 'Annual workplace health and safety risk assessment', 'QLD', 'General', '2024', 365, true, 'https://www.worksafe.qld.gov.au/'),
('Fire Safety Equipment Check', 'fire_safety', 'Monthly fire safety equipment inspection', 'QLD', 'General', '2024', 30, true, 'https://www.qfes.qld.gov.au/'),
('Fire Evacuation Drill', 'fire_safety', 'Quarterly fire evacuation drill', 'QLD', 'General', '2024', 90, true, null),
('Test and Tag Inspection', 'test_tag', 'Portable appliance testing and tagging', 'QLD', 'General', '2024', 365, true, 'https://www.worksafe.qld.gov.au/');