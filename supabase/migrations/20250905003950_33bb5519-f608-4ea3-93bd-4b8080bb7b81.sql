-- Phase 2.1b: Create subscription tables and update roles

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

-- Update existing admin to platform_admin (now that enum values exist)
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