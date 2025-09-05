import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Settings, 
  Globe, 
  Mail, 
  Shield, 
  Database,
  Users,
  Bell,
  FileText 
} from 'lucide-react';

interface PlatformSettings {
  // General Settings
  platform_name: string;
  platform_description: string;
  support_email: string;
  company_address: string;
  
  // Feature Toggles
  customer_registration_enabled: boolean;
  email_verification_required: boolean;
  two_factor_auth_enabled: boolean;
  public_api_enabled: boolean;
  audit_logging_enabled: boolean;
  
  // Limits & Quotas
  max_organizations_per_customer: number;
  max_users_per_organization: number;
  default_storage_quota_gb: number;
  api_rate_limit_per_minute: number;
  
  // Email & Notifications
  smtp_enabled: boolean;
  welcome_email_enabled: boolean;
  billing_notifications_enabled: boolean;
  system_maintenance_notifications: boolean;
  
  // Compliance & Security
  data_retention_months: number;
  password_min_length: number;
  session_timeout_minutes: number;
  ip_whitelist_enabled: boolean;
}

export default function PlatformSettings() {
  const [settings, setSettings] = useState<PlatformSettings>({
    // General Settings
    platform_name: 'ComplyEasy',
    platform_description: 'Compliance management platform for Australian businesses',
    support_email: 'support@complyeasy.com',
    company_address: '',
    
    // Feature Toggles
    customer_registration_enabled: true,
    email_verification_required: true,
    two_factor_auth_enabled: false,
    public_api_enabled: false,
    audit_logging_enabled: true,
    
    // Limits & Quotas
    max_organizations_per_customer: 3,
    max_users_per_organization: 50,
    default_storage_quota_gb: 10,
    api_rate_limit_per_minute: 100,
    
    // Email & Notifications
    smtp_enabled: true,
    welcome_email_enabled: true,
    billing_notifications_enabled: true,
    system_maintenance_notifications: true,
    
    // Compliance & Security
    data_retention_months: 24,
    password_min_length: 8,
    session_timeout_minutes: 480,
    ip_whitelist_enabled: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPlatformSettings();
  }, []);

  const loadPlatformSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('setting_key, setting_value, setting_type');

      if (error) throw error;

      // Convert database settings to component state
      const settingsMap: Record<string, any> = {};
      data?.forEach(setting => {
        let value = setting.setting_value;
        
        // Parse JSON values
        if (typeof value === 'string') {
          try {
            value = JSON.parse(value);
          } catch (e) {
            // Keep as string if not valid JSON
          }
        }
        
        settingsMap[setting.setting_key] = value;
      });

      setSettings(prev => ({ ...prev, ...settingsMap }));
      setLoading(false);
    } catch (error) {
      console.error('Error loading platform settings:', error);
      toast({
        title: "Error",
        description: "Failed to load platform settings",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Prepare settings for database update
      const updates = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: JSON.stringify(value),
        updated_at: new Date().toISOString()
      }));

      // Update all settings
      for (const update of updates) {
        const { error } = await supabase
          .from('platform_settings')
          .update({
            setting_value: update.setting_value,
            updated_at: update.updated_at
          })
          .eq('setting_key', update.setting_key);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Platform settings updated successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save platform settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof PlatformSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground">
          Configure platform-wide settings, features, and security policies
        </p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>General Settings</span>
            </CardTitle>
            <CardDescription>
              Basic platform information and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Platform Name</Label>
                <Input
                  value={settings.platform_name}
                  onChange={(e) => updateField('platform_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input
                  type="email"
                  value={settings.support_email}
                  onChange={(e) => updateField('support_email', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Platform Description</Label>
              <Textarea
                value={settings.platform_description}
                onChange={(e) => updateField('platform_description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Company Address</Label>
              <Textarea
                value={settings.company_address}
                onChange={(e) => updateField('company_address', e.target.value)}
                rows={3}
                placeholder="Enter your company's physical address..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Feature Toggles</span>
            </CardTitle>
            <CardDescription>
              Enable or disable platform features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Customer Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new customers to register</p>
                  </div>
                  <Switch
                    checked={settings.customer_registration_enabled}
                    onCheckedChange={(checked) => updateField('customer_registration_enabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                  </div>
                  <Switch
                    checked={settings.email_verification_required}
                    onCheckedChange={(checked) => updateField('email_verification_required', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Enable 2FA for enhanced security</p>
                  </div>
                  <Switch
                    checked={settings.two_factor_auth_enabled}
                    onCheckedChange={(checked) => updateField('two_factor_auth_enabled', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public API</Label>
                    <p className="text-sm text-muted-foreground">Enable public API access</p>
                  </div>
                  <Switch
                    checked={settings.public_api_enabled}
                    onCheckedChange={(checked) => updateField('public_api_enabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Log all user actions for compliance</p>
                  </div>
                  <Switch
                    checked={settings.audit_logging_enabled}
                    onCheckedChange={(checked) => updateField('audit_logging_enabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Whitelisting</Label>
                    <p className="text-sm text-muted-foreground">Restrict access by IP address</p>
                  </div>
                  <Switch
                    checked={settings.ip_whitelist_enabled}
                    onCheckedChange={(checked) => updateField('ip_whitelist_enabled', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limits & Quotas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Limits & Quotas</span>
            </CardTitle>
            <CardDescription>
              Set platform-wide limits and resource quotas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Max Organizations per Customer</Label>
                <Input
                  type="number"
                  value={settings.max_organizations_per_customer}
                  onChange={(e) => updateField('max_organizations_per_customer', parseInt(e.target.value) || 0)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label>Max Users per Organization</Label>
                <Input
                  type="number"
                  value={settings.max_users_per_organization}
                  onChange={(e) => updateField('max_users_per_organization', parseInt(e.target.value) || 0)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label>Default Storage Quota (GB)</Label>
                <Input
                  type="number"
                  value={settings.default_storage_quota_gb}
                  onChange={(e) => updateField('default_storage_quota_gb', parseInt(e.target.value) || 0)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label>API Rate Limit (per minute)</Label>
                <Input
                  type="number"
                  value={settings.api_rate_limit_per_minute}
                  onChange={(e) => updateField('api_rate_limit_per_minute', parseInt(e.target.value) || 0)}
                  min="10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Email & Notifications</span>
            </CardTitle>
            <CardDescription>
              Configure email and notification settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMTP Email</Label>
                    <p className="text-sm text-muted-foreground">Enable email sending via SMTP</p>
                  </div>
                  <Switch
                    checked={settings.smtp_enabled}
                    onCheckedChange={(checked) => updateField('smtp_enabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Welcome Emails</Label>
                    <p className="text-sm text-muted-foreground">Send welcome emails to new users</p>
                  </div>
                  <Switch
                    checked={settings.welcome_email_enabled}
                    onCheckedChange={(checked) => updateField('welcome_email_enabled', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Billing Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send billing and payment notifications</p>
                  </div>
                  <Switch
                    checked={settings.billing_notifications_enabled}
                    onCheckedChange={(checked) => updateField('billing_notifications_enabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Notifications</Label>
                    <p className="text-sm text-muted-foreground">Notify users of system maintenance</p>
                  </div>
                  <Switch
                    checked={settings.system_maintenance_notifications}
                    onCheckedChange={(checked) => updateField('system_maintenance_notifications', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Security & Compliance</span>
            </CardTitle>
            <CardDescription>
              Configure security policies and compliance settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Data Retention (Months)</Label>
                <Input
                  type="number"
                  value={settings.data_retention_months}
                  onChange={(e) => updateField('data_retention_months', parseInt(e.target.value) || 0)}
                  min="6"
                  max="120"
                />
              </div>
              <div className="space-y-2">
                <Label>Min Password Length</Label>
                <Input
                  type="number"
                  value={settings.password_min_length}
                  onChange={(e) => updateField('password_min_length', parseInt(e.target.value) || 0)}
                  min="6"
                  max="20"
                />
              </div>
              <div className="space-y-2">
                <Label>Session Timeout (Minutes)</Label>
                <Input
                  type="number"
                  value={settings.session_timeout_minutes}
                  onChange={(e) => updateField('session_timeout_minutes', parseInt(e.target.value) || 0)}
                  min="15"
                  max="1440"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={saving} size="lg">
            {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />}
            Save Platform Settings
          </Button>
        </div>
      </div>
    </div>
  );
}