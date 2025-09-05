-- Create platform_settings table for admin configuration
CREATE TABLE public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  setting_type TEXT NOT NULL DEFAULT 'string',
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default platform settings
INSERT INTO public.platform_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
-- General Settings
('platform_name', '"ComplyEasy"', 'string', 'general', 'Platform display name', true),
('platform_description', '"Compliance management platform for Australian businesses"', 'string', 'general', 'Platform description', true),
('support_email', '"support@complyeasy.com"', 'string', 'general', 'Support contact email', false),
('company_address', '""', 'string', 'general', 'Company physical address', false),

-- Feature Toggles
('customer_registration_enabled', 'true', 'boolean', 'features', 'Allow new customer registration', false),
('email_verification_required', 'true', 'boolean', 'features', 'Require email verification', false),
('two_factor_auth_enabled', 'false', 'boolean', 'features', 'Enable two-factor authentication', false),
('public_api_enabled', 'false', 'boolean', 'features', 'Enable public API access', false),
('audit_logging_enabled', 'true', 'boolean', 'features', 'Enable audit logging', false),

-- Limits & Quotas
('max_organizations_per_customer', '3', 'number', 'limits', 'Maximum organizations per customer', false),
('max_users_per_organization', '50', 'number', 'limits', 'Maximum users per organization', false),
('default_storage_quota_gb', '10', 'number', 'limits', 'Default storage quota in GB', false),
('api_rate_limit_per_minute', '100', 'number', 'limits', 'API rate limit per minute', false),

-- Email & Notifications
('smtp_enabled', 'true', 'boolean', 'notifications', 'Enable SMTP email sending', false),
('welcome_email_enabled', 'true', 'boolean', 'notifications', 'Send welcome emails', false),
('billing_notifications_enabled', 'true', 'boolean', 'notifications', 'Send billing notifications', false),
('system_maintenance_notifications', 'true', 'boolean', 'notifications', 'Send maintenance notifications', false),

-- Security & Compliance
('data_retention_months', '24', 'number', 'security', 'Data retention period in months', false),
('password_min_length', '8', 'number', 'security', 'Minimum password length', false),
('session_timeout_minutes', '480', 'number', 'security', 'Session timeout in minutes', false),
('ip_whitelist_enabled', 'false', 'boolean', 'security', 'Enable IP whitelisting', false),

-- Payment Settings
('stripe_mode', '"test"', 'string', 'payment', 'Stripe mode (test/live)', false),
('default_currency', '"aud"', 'string', 'payment', 'Default currency', false),
('trial_period_days', '14', 'number', 'payment', 'Trial period in days', false),
('grace_period_days', '7', 'number', 'payment', 'Grace period in days', false),
('tax_calculation_enabled', 'false', 'boolean', 'payment', 'Enable automatic tax calculation', false),
('dunning_enabled', 'true', 'boolean', 'payment', 'Enable smart dunning', false),
('payment_retry_attempts', '3', 'number', 'payment', 'Payment retry attempts', false),
('invoice_footer', '"Thank you for your business with ComplyEasy."', 'string', 'payment', 'Invoice footer text', false);

-- Create customer_billing_history table for invoice tracking
CREATE TABLE public.customer_billing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.customer_subscriptions(id),
  invoice_number TEXT NOT NULL UNIQUE,
  stripe_invoice_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'aud',
  status TEXT NOT NULL DEFAULT 'pending',
  billing_period_start TIMESTAMPTZ NOT NULL,
  billing_period_end TIMESTAMPTZ NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  paid_date TIMESTAMPTZ,
  invoice_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create customer_payment_methods table
CREATE TABLE public.customer_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT NOT NULL,
  type TEXT NOT NULL,
  last_four TEXT,
  brand TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create account_deletions table for soft delete tracking
CREATE TABLE public.account_deletions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  reason TEXT,
  deleted_by UUID NOT NULL REFERENCES auth.users(id),
  deletion_type TEXT NOT NULL DEFAULT 'customer_request',
  data_retention_until TIMESTAMPTZ NOT NULL,
  billing_access_maintained BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_billing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_deletions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for platform_settings
CREATE POLICY "platform_settings_platform_admin_all" ON public.platform_settings
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'platform_admin'
  ));

CREATE POLICY "platform_settings_public_read" ON public.platform_settings
  FOR SELECT 
  USING (is_public = true);

-- Create RLS policies for customer_billing_history
CREATE POLICY "billing_history_own" ON public.customer_billing_history
  FOR SELECT 
  USING (customer_id = auth.uid());

CREATE POLICY "billing_history_platform_admin_all" ON public.customer_billing_history
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'platform_admin'
  ));

-- Create RLS policies for customer_payment_methods
CREATE POLICY "payment_methods_own" ON public.customer_payment_methods
  FOR ALL 
  USING (customer_id = auth.uid());

CREATE POLICY "payment_methods_platform_admin_read" ON public.customer_payment_methods
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'platform_admin'
  ));

-- Create RLS policies for account_deletions
CREATE POLICY "account_deletions_platform_admin_all" ON public.account_deletions
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'platform_admin'
  ));

-- Create triggers for updated_at
CREATE TRIGGER update_platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_billing_history_updated_at
  BEFORE UPDATE ON public.customer_billing_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_payment_methods_updated_at
  BEFORE UPDATE ON public.customer_payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_platform_settings_category ON public.platform_settings(category);
CREATE INDEX idx_platform_settings_key ON public.platform_settings(setting_key);
CREATE INDEX idx_billing_history_customer ON public.customer_billing_history(customer_id);
CREATE INDEX idx_billing_history_status ON public.customer_billing_history(status);
CREATE INDEX idx_payment_methods_customer ON public.customer_payment_methods(customer_id);
CREATE INDEX idx_account_deletions_customer ON public.account_deletions(customer_id);