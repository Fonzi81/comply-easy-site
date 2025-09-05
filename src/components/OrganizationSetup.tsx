import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface OrganizationSetupProps {
  onComplete: () => void;
}

export const OrganizationSetup = ({ onComplete }: OrganizationSetupProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orgData, setOrgData] = useState({
    name: '',
    industry: '',
    address: '',
    email: '',
    phone: ''
  });

  const industries = [
    'Food & Beverage',
    'Childcare',
    'Retail',
    'Manufacturing',
    'Healthcare',
    'Education',
    'Construction',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Create organization
      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: orgData.name,
          industry: orgData.industry,
          address: orgData.address,
          email: orgData.email,
          phone: orgData.phone,
          created_by: user.id
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Add user as organization member
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: organization.id,
          user_id: user.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      toast.success('Organization created successfully!');
      onComplete();
    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast.error('Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Compliance Co!</CardTitle>
          <CardDescription>
            Let's set up your organization to get started with compliance management
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="orgName">Organization Name *</Label>
              <Input
                id="orgName"
                placeholder="Enter your business name"
                value={orgData.name}
                onChange={(e) => setOrgData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Select 
                value={orgData.industry} 
                onValueChange={(value) => setOrgData(prev => ({ ...prev, industry: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="address">Business Address</Label>
              <Textarea
                id="address"
                placeholder="Enter your business address"
                value={orgData.address}
                onChange={(e) => setOrgData(prev => ({ ...prev, address: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@yourbusiness.com"
                  value={orgData.email}
                  onChange={(e) => setOrgData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+61 400 000 000"
                  value={orgData.phone}
                  onChange={(e) => setOrgData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">What happens next?</p>
                  <p className="text-sm text-muted-foreground">
                    After creating your organization, you'll be able to invite team members, 
                    set up compliance tasks, and start managing your business compliance requirements.
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !orgData.name.trim() || !orgData.industry}>
              {loading ? 'Creating Organization...' : 'Create Organization'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};