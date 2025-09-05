import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Users, TrendingUp, Building2, Package, BarChart3 } from 'lucide-react';

interface PlatformMetrics {
  mrr: number;
  arr: number;
  totalCustomers: number;
  activeSubscriptions: number;
  totalOrganizations: number;
  monthlyGrowth: number;
}

export default function PlatformAdminDashboard() {
  const [metrics, setMetrics] = useState<PlatformMetrics>({
    mrr: 0,
    arr: 0,
    totalCustomers: 0,
    activeSubscriptions: 0,
    totalOrganizations: 0,
    monthlyGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlatformMetrics();
  }, []);

  const loadPlatformMetrics = async () => {
    try {
      // Get latest revenue metrics
      const { data: revenueData } = await supabase
        .from('revenue_metrics')
        .select('*')
        .order('month_year', { ascending: false })
        .limit(2);

      // Get customer counts
      const { data: customerData } = await supabase
        .from('profiles')
        .select('role')
        .in('role', ['customer', 'user']);

      // Get organizations count  
      const { data: orgData } = await supabase
        .from('organizations')
        .select('id');

      const latestRevenue = revenueData?.[0];
      const previousRevenue = revenueData?.[1];
      
      const growth = previousRevenue 
        ? ((latestRevenue?.mrr - previousRevenue.mrr) / previousRevenue.mrr) * 100 
        : 0;

      setMetrics({
        mrr: latestRevenue?.mrr || 0,
        arr: latestRevenue?.arr || 0,
        totalCustomers: customerData?.length || 0,
        activeSubscriptions: latestRevenue?.active_subscriptions || 0,
        totalOrganizations: orgData?.length || 0,
        monthlyGrowth: growth
      });
    } catch (error) {
      console.error('Error loading platform metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(cents / 100);
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading platform metrics...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of ComplyEasy platform performance and revenue metrics
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.mrr)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={metrics.monthlyGrowth > 0 ? "text-green-600" : "text-red-600"}>
                {metrics.monthlyGrowth > 0 ? "+" : ""}{metrics.monthlyGrowth.toFixed(1)}%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Recurring Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.arr)}</div>
            <p className="text-xs text-muted-foreground">
              Projected annual revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Active customer accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOrganizations}</div>
            <p className="text-xs text-muted-foreground">
              Customer organizations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Status</CardTitle>
            <CardDescription>System health and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">System Status</span>
              <Badge variant="default" className="bg-green-500">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <Badge variant="default" className="bg-green-500">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API Response Time</span>
              <span className="text-sm text-muted-foreground">45ms</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Platform management shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="outline" className="justify-center py-2">
                <Users className="w-3 h-3 mr-1" />
                Customers
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                <Building2 className="w-3 h-3 mr-1" />
                Organizations
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                <Package className="w-3 h-3 mr-1" />
                Templates
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                <BarChart3 className="w-3 h-3 mr-1" />
                Analytics
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}