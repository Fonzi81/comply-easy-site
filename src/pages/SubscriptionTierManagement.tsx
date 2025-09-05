import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Save, X, Check, DollarSign, Users, Database, Cog } from 'lucide-react';

interface SubscriptionTier {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  max_users: number;
  max_sites: number;
  max_tasks: number;
  storage_gb: number;
  features: Record<string, any>;
  is_active: boolean;
}

interface PlatformFeature {
  key: string;
  name: string;
  description: string;
  category: string;
}

const platformFeatures: PlatformFeature[] = [
  { key: 'advanced_analytics', name: 'Advanced Analytics', description: 'Detailed reporting and insights', category: 'Analytics' },
  { key: 'custom_templates', name: 'Custom Templates', description: 'Create and modify compliance templates', category: 'Templates' },
  { key: 'api_access', name: 'API Access', description: 'Programmatic access to platform data', category: 'Integration' },
  { key: 'priority_support', name: 'Priority Support', description: '24/7 priority customer support', category: 'Support' },
  { key: 'white_labeling', name: 'White Labeling', description: 'Remove branding and customize appearance', category: 'Branding' },
  { key: 'audit_packs', name: 'Audit Pack Generation', description: 'Generate comprehensive audit reports', category: 'Compliance' },
  { key: 'bulk_operations', name: 'Bulk Operations', description: 'Perform operations on multiple items', category: 'Productivity' },
  { key: 'advanced_permissions', name: 'Advanced Permissions', description: 'Granular user role management', category: 'Security' },
];

export default function SubscriptionTierManagement() {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTiers();
  }, []);

  const loadTiers = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('*')
        .order('price_monthly', { ascending: true });

      if (error) throw error;
      setTiers((data as any[])?.map(tier => ({
        ...tier,
        features: typeof tier.features === 'string' ? JSON.parse(tier.features) : tier.features || {}
      })) || []);
    } catch (error) {
      console.error('Error loading tiers:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription tiers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTier = async (tier: SubscriptionTier) => {
    setSaving(tier.id);
    try {
      const { error } = await supabase
        .from('subscription_tiers')
        .update({
          name: tier.name,
          price_monthly: tier.price_monthly,
          price_yearly: tier.price_yearly,
          max_users: tier.max_users,
          max_sites: tier.max_sites,
          max_tasks: tier.max_tasks,
          storage_gb: tier.storage_gb,
          features: tier.features,
          is_active: tier.is_active,
        })
        .eq('id', tier.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscription tier updated successfully",
      });
      
      setEditingTier(null);
      loadTiers();
    } catch (error) {
      console.error('Error saving tier:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription tier",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const updateTierField = (tierId: string, field: string, value: any) => {
    setTiers(prev => prev.map(tier => 
      tier.id === tierId ? { ...tier, [field]: value } : tier
    ));
  };

  const toggleFeature = (tierId: string, featureKey: string, enabled: boolean) => {
    setTiers(prev => prev.map(tier => 
      tier.id === tierId 
        ? { 
            ...tier, 
            features: { 
              ...tier.features, 
              [featureKey]: enabled 
            } 
          } 
        : tier
    ));
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
        <h1 className="text-3xl font-bold tracking-tight">Subscription Tier Management</h1>
        <p className="text-muted-foreground">
          Configure pricing tiers, features, and limits for your platform
        </p>
      </div>

      <div className="grid gap-6">
        {tiers.map((tier) => (
          <Card key={tier.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {editingTier === tier.id ? (
                    <Input
                      value={tier.name}
                      onChange={(e) => updateTierField(tier.id, 'name', e.target.value)}
                      className="text-xl font-semibold w-auto"
                    />
                  ) : (
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                  )}
                  <Badge variant={tier.is_active ? "default" : "secondary"}>
                    {tier.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  {editingTier === tier.id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => saveTier(tier)}
                        disabled={saving === tier.id}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingTier(null);
                          loadTiers();
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingTier(tier.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Monthly Price ($)</Label>
                  {editingTier === tier.id ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={(tier.price_monthly / 100).toFixed(2)}
                      onChange={(e) => updateTierField(tier.id, 'price_monthly', Math.round(parseFloat(e.target.value) * 100) || 0)}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>${(tier.price_monthly / 100).toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Yearly Price ($)</Label>
                  {editingTier === tier.id ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={(tier.price_yearly / 100).toFixed(2)}
                      onChange={(e) => updateTierField(tier.id, 'price_yearly', Math.round(parseFloat(e.target.value) * 100) || 0)}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>${(tier.price_yearly / 100).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Limits */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Max Users</Label>
                  {editingTier === tier.id ? (
                    <Input
                      type="number"
                      value={tier.max_users}
                      onChange={(e) => updateTierField(tier.id, 'max_users', parseInt(e.target.value) || 0)}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{tier.max_users}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Max Sites</Label>
                  {editingTier === tier.id ? (
                    <Input
                      type="number"
                      value={tier.max_sites}
                      onChange={(e) => updateTierField(tier.id, 'max_sites', parseInt(e.target.value) || 0)}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Cog className="w-4 h-4" />
                      <span>{tier.max_sites}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Max Tasks</Label>
                  {editingTier === tier.id ? (
                    <Input
                      type="number"
                      value={tier.max_tasks}
                      onChange={(e) => updateTierField(tier.id, 'max_tasks', parseInt(e.target.value) || 0)}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4" />
                      <span>{tier.max_tasks}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Storage (GB)</Label>
                  {editingTier === tier.id ? (
                    <Input
                      type="number"
                      value={tier.storage_gb}
                      onChange={(e) => updateTierField(tier.id, 'storage_gb', parseInt(e.target.value) || 0)}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4" />
                      <span>{tier.storage_gb} GB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <Label>Features</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {platformFeatures.map((feature) => (
                    <div key={feature.key} className="flex items-center space-x-2 p-2 border rounded">
                      <Switch
                        checked={tier.features[feature.key] || false}
                        onCheckedChange={(checked) => toggleFeature(tier.id, feature.key, checked)}
                        disabled={editingTier !== tier.id}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{feature.name}</div>
                        <div className="text-xs text-muted-foreground">{feature.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <Switch
                  checked={tier.is_active}
                  onCheckedChange={(checked) => updateTierField(tier.id, 'is_active', checked)}
                  disabled={editingTier !== tier.id}
                />
                <Label>Active (visible to customers)</Label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}