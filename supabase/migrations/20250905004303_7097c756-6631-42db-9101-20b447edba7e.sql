-- Phase 2.1c: Add sample data and triggers

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

-- Add some sample revenue metrics
INSERT INTO public.revenue_metrics (month_year, mrr, arr, new_customers, churned_customers, active_subscriptions, trial_conversions) VALUES
  ('2024-11-01', 285000, 3420000, 12, 2, 58, 8),
  ('2024-12-01', 295000, 3540000, 15, 3, 61, 10),
  ('2025-01-01', 310000, 3720000, 18, 1, 64, 12);

-- Add triggers for updated_at columns
CREATE TRIGGER update_subscription_tiers_updated_at
  BEFORE UPDATE ON public.subscription_tiers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_subscriptions_updated_at  
  BEFORE UPDATE ON public.customer_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();