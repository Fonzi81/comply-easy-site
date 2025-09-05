-- Phase 2.1: Business Logic and Subscription Architecture

-- Create subscription tiers table
CREATE TABLE public.subscription_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE, -- 'Basic', 'Pro', 'Enterprise'
  price_monthly integer NOT NULL, -- in cents
  price_yearly integer NOT NULL, -- in cents  
  features jsonb NOT NULL DEFAULT '{}',
  max_sites integer DEFAULT 1,
  max_users integer DEFAULT 5,
  max_tasks integer DEFAULT 100,
  storage_gb integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customer subscriptions table
CREATE TABLE public.customer_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier_id uuid REFERENCES public.subscription_tiers(id),
  billing_cycle text CHECK (billing_cycle IN ('monthly', 'yearly')) DEFAULT 'monthly',
  status text CHECK (status IN ('active', 'trial', 'canceled', 'expired')) DEFAULT 'trial',
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz DEFAULT now() + interval '30 days',
  mrr integer DEFAULT 0, -- Monthly Recurring Revenue in cents
  stripe_customer_id text,
  stripe_subscription_id text,
  trial_ends_at timestamptz DEFAULT now() + interval '14 days',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create revenue metrics table for platform analytics
CREATE TABLE public.revenue_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month_year date NOT NULL UNIQUE,
  mrr integer NOT NULL DEFAULT 0, -- Monthly Recurring Revenue
  arr integer NOT NULL DEFAULT 0, -- Annual Recurring Revenue  
  new_customers integer DEFAULT 0,
  churned_customers integer DEFAULT 0,
  active_subscriptions integer DEFAULT 0,
  trial_conversions integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Update role enum to separate platform admins from customers
ALTER TYPE user_role ADD VALUE 'platform_admin';
ALTER TYPE user_role ADD VALUE 'customer';

-- Update existing admin to platform_admin
UPDATE public.profiles SET role = 'platform_admin' WHERE role = 'admin';

-- Enable RLS on new tables
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_subscriptions ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.revenue_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_tiers (publicly viewable)
CREATE POLICY "subscription_tiers_select_all" ON public.subscription_tiers
  FOR SELECT USING (is_active = true);

CREATE POLICY "subscription_tiers_platform_admin_all" ON public.subscription_tiers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'platform_admin')
  );

-- RLS Policies for customer_subscriptions
CREATE POLICY "customer_subscriptions_own" ON public.customer_subscriptions
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "customer_subscriptions_platform_admin_all" ON public.customer_subscriptions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'platform_admin')
  );

-- RLS Policies for revenue_metrics (platform admin only)
CREATE POLICY "revenue_metrics_platform_admin_only" ON public.revenue_metrics
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'platform_admin')
  );

-- Insert default subscription tiers
INSERT INTO public.subscription_tiers (name, price_monthly, price_yearly, features, max_sites, max_users, max_tasks, storage_gb) VALUES
  ('Basic', 4900, 49000, '{"compliance_templates": true, "basic_reporting": true, "email_support": true}', 1, 5, 100, 1),
  ('Pro', 9900, 99000, '{"compliance_templates": true, "advanced_reporting": true, "priority_support": true, "custom_templates": true, "api_access": true}', 3, 15, 500, 5),
  ('Enterprise', 19900, 199000, '{"compliance_templates": true, "advanced_reporting": true, "premium_support": true, "custom_templates": true, "api_access": true, "white_label": true, "sso": true}', 10, 50, 2000, 20);

-- Add sample organizations to fix loading issues
INSERT INTO public.organizations (name, industry, email, phone, address, created_by) VALUES
  ('Cafe North Brisbane', 'Food Service', 'manager@cafenorth.com.au', '+61 7 3000 1111', '123 Queen Street, Brisbane QLD 4000', (SELECT id FROM public.profiles WHERE role = 'platform_admin' LIMIT 1)),
  ('Sunshine Childcare Centre', 'Childcare', 'admin@sunshinekids.com.au', '+61 7 3000 2222', '456 Logan Road, Brisbane QLD 4102', (SELECT id FROM public.profiles WHERE role = 'platform_admin' LIMIT 1)),
  ('Metro Manufacturing', 'Manufacturing', 'safety@metromanuf.com.au', '+61 7 3000 3333', '789 Industrial Ave, Brisbane QLD 4178', (SELECT id FROM public.profiles WHERE role = 'platform_admin' LIMIT 1));

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscription_tiers_updated_at
  BEFORE UPDATE ON public.subscription_tiers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_subscriptions_updated_at  
  BEFORE UPDATE ON public.customer_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();