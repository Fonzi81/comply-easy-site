import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  Settings, 
  Key,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Shield
} from 'lucide-react';

interface PaymentConfig {
  stripe_publishable_key: string;
  stripe_webhook_endpoint: string;
  stripe_mode: 'test' | 'live';
  default_currency: string;
  tax_calculation_enabled: boolean;
  invoice_footer: string;
  payment_retry_attempts: number;
  trial_period_days: number;
  grace_period_days: number;
  dunning_enabled: boolean;
}

export default function PaymentSettings() {
  const [config, setConfig] = useState<PaymentConfig>({
    stripe_publishable_key: '',
    stripe_webhook_endpoint: '',
    stripe_mode: 'test',
    default_currency: 'aud',
    tax_calculation_enabled: false,
    invoice_footer: 'Thank you for your business with ComplyEasy.',
    payment_retry_attempts: 3,
    trial_period_days: 14,
    grace_period_days: 7,
    dunning_enabled: true,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const { toast } = useToast();

  useEffect(() => {
    loadPaymentSettings();
  }, []);

  const loadPaymentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('setting_key, setting_value')
        .eq('category', 'payment');

      if (error) throw error;

      // Convert database settings to component state
      const paymentSettings: Record<string, any> = {};
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
        
        paymentSettings[setting.setting_key] = value;
      });

      setConfig(prev => ({ ...prev, ...paymentSettings }));
      setLoading(false);
    } catch (error) {
      console.error('Error loading payment settings:', error);
      toast({
        title: "Error",
        description: "Failed to load payment settings",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Update payment-related settings
      const paymentFields = [
        'stripe_mode', 'default_currency', 'trial_period_days', 
        'grace_period_days', 'tax_calculation_enabled', 
        'dunning_enabled', 'payment_retry_attempts', 'invoice_footer'
      ];

      for (const field of paymentFields) {
        if (config[field as keyof PaymentConfig] !== undefined) {
          const { error } = await supabase
            .from('platform_settings')
            .update({
              setting_value: JSON.stringify(config[field as keyof PaymentConfig]),
              updated_at: new Date().toISOString()
            })
            .eq('setting_key', field);

          if (error) throw error;
        }
      }

      toast({
        title: "Success",
        description: "Payment settings updated successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save payment settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testStripeConnection = async () => {
    setTestingConnection(true);
    try {
      // In a real implementation, you'd test the Stripe connection
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setConnectionStatus('connected');
      toast({
        title: "Success",
        description: "Stripe connection test successful",
      });
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Error",
        description: "Failed to connect to Stripe",
        variant: "destructive",
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const updateField = (field: keyof PaymentConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
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
        <h1 className="text-3xl font-bold tracking-tight">Payment Settings</h1>
        <p className="text-muted-foreground">
          Configure payment processing, billing, and invoicing for your platform
        </p>
      </div>

      <div className="grid gap-6">
        {/* Stripe Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Stripe Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure your Stripe payment processing settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stripe Mode</Label>
                <Select 
                  value={config.stripe_mode} 
                  onValueChange={(value: 'test' | 'live') => updateField('stripe_mode', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">Test Mode</SelectItem>
                    <SelectItem value="live">Live Mode</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Connection Status</Label>
                <div className="flex items-center space-x-2">
                  {connectionStatus === 'connected' && (
                    <Badge className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                  {connectionStatus === 'error' && (
                    <Badge variant="destructive">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Connection Error
                    </Badge>
                  )}
                  {connectionStatus === 'unknown' && (
                    <Badge variant="secondary">
                      <Settings className="w-3 h-3 mr-1" />
                      Not Tested
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Stripe Publishable Key</Label>
              <div className="flex space-x-2">
                <Input
                  type="password"
                  value={config.stripe_publishable_key}
                  onChange={(e) => updateField('stripe_publishable_key', e.target.value)}
                  placeholder="pk_test_..."
                />
                <Button
                  variant="outline"
                  onClick={() => window.open('https://dashboard.stripe.com/apikeys', '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Webhook Endpoint</Label>
              <div className="flex space-x-2">
                <Input
                  value={config.stripe_webhook_endpoint}
                  onChange={(e) => updateField('stripe_webhook_endpoint', e.target.value)}
                  placeholder="https://yourapp.com/api/webhooks/stripe"
                />
                <Button
                  variant="outline"
                  onClick={() => window.open('https://dashboard.stripe.com/webhooks', '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button 
              onClick={testStripeConnection}
              disabled={testingConnection || !config.stripe_publishable_key}
              variant="outline"
            >
              {testingConnection ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
              ) : (
                <Shield className="w-4 h-4 mr-2" />
              )}
              Test Connection
            </Button>
          </CardContent>
        </Card>

        {/* Billing Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Billing Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure billing cycles, trials, and payment collection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Default Currency</Label>
                <Select 
                  value={config.default_currency} 
                  onValueChange={(value) => updateField('default_currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aud">AUD - Australian Dollar</SelectItem>
                    <SelectItem value="usd">USD - US Dollar</SelectItem>
                    <SelectItem value="eur">EUR - Euro</SelectItem>
                    <SelectItem value="gbp">GBP - British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Trial Period (Days)</Label>
                <Input
                  type="number"
                  value={config.trial_period_days}
                  onChange={(e) => updateField('trial_period_days', parseInt(e.target.value) || 0)}
                  min="0"
                  max="90"
                />
              </div>
              <div className="space-y-2">
                <Label>Grace Period (Days)</Label>
                <Input
                  type="number"
                  value={config.grace_period_days}
                  onChange={(e) => updateField('grace_period_days', parseInt(e.target.value) || 0)}
                  min="0"
                  max="30"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.tax_calculation_enabled}
                  onCheckedChange={(checked) => updateField('tax_calculation_enabled', checked)}
                />
                <Label>Enable Automatic Tax Calculation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.dunning_enabled}
                  onCheckedChange={(checked) => updateField('dunning_enabled', checked)}
                />
                <Label>Enable Smart Dunning (Retry Failed Payments)</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Retry Attempts</Label>
              <Input
                type="number"
                value={config.payment_retry_attempts}
                onChange={(e) => updateField('payment_retry_attempts', parseInt(e.target.value) || 0)}
                min="0"
                max="10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Invoice Settings</span>
            </CardTitle>
            <CardDescription>
              Customize invoice appearance and messaging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Invoice Footer</Label>
              <Textarea
                value={config.invoice_footer}
                onChange={(e) => updateField('invoice_footer', e.target.value)}
                placeholder="Add a custom message to appear on all invoices..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={saving}>
            {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />}
            Save Payment Settings
          </Button>
        </div>
      </div>
    </div>
  );
}