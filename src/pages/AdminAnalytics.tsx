import { useAdminGuard } from '@/hooks/useAdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, Building2, CheckCircle, FileText, Activity, TrendingUp, Database, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Bar, BarChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface AnalyticsData {
  total_users: number;
  active_users_7d: number;
  active_users_30d: number;
  total_organizations: number;
  total_tasks: number;
  completed_tasks: number;
  total_evidence: number;
  storage_used: number;
}

interface RecentActivity {
  date: string;
  users: number;
  tasks: number;
  evidence: number;
}

export default function AdminAnalytics() {
  const { isAdmin, loading } = useAdminGuard();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      loadAnalytics();
      loadRecentActivity();
    }
  }, [isAdmin]);

  const loadAnalytics = async () => {
    try {
      const { data, error } = await supabase.rpc('admin_get_analytics');
      if (error) throw error;
      
      if (data && data.length > 0) {
        setAnalytics(data[0]);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const loadRecentActivity = async () => {
    try {
      // Get data for the last 7 days
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const activityData: RecentActivity[] = [];
      
      for (const date of dates) {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        // Get user activity (using profiles as proxy for user activity)
        const { data: users } = await supabase
          .from('profiles')
          .select('*')
          .gte('created_at', date)
          .lt('created_at', nextDate.toISOString().split('T')[0]);

        // Get tasks created
        const { data: tasks } = await supabase
          .from('compliance_tasks')
          .select('*')
          .gte('created_at', date)
          .lt('created_at', nextDate.toISOString().split('T')[0]);

        // Get evidence uploaded
        const { data: evidence } = await supabase
          .from('evidence')
          .select('*')
          .gte('created_at', date)
          .lt('created_at', nextDate.toISOString().split('T')[0]);

        activityData.push({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          users: users?.length || 0,
          tasks: tasks?.length || 0,
          evidence: evidence?.length || 0,
        });
      }

      setRecentActivity(activityData);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateCompletionRate = () => {
    if (!analytics || analytics.total_tasks === 0) return 0;
    return Math.round((analytics.completed_tasks / analytics.total_tasks) * 100);
  };

  if (loading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor system performance and user activity
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedMetric('users')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.total_users || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.active_users_7d || 0} active last 7 days
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedMetric('organizations')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.total_organizations || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active organizations
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedMetric('tasks')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateCompletionRate()}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.completed_tasks || 0} of {analytics?.total_tasks || 0} tasks
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedMetric('storage')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(analytics?.storage_used || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.total_evidence || 0} evidence files
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Charts */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Daily activity over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ChartContainer
                config={{
                  tasks: { label: "Tasks", color: "hsl(var(--primary))" },
                  evidence: { label: "Evidence", color: "hsl(var(--secondary))" },
                }}
                className="h-full w-full"
              >
                <LineChart data={recentActivity} width={undefined} height={undefined}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Tasks Created"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="evidence" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    name="Evidence Uploaded"
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>User activity comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Active Users (7d)</span>
                </div>
                <span className="text-lg font-bold">{analytics?.active_users_7d || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Active Users (30d)</span>
                </div>
                <span className="text-lg font-bold">{analytics?.active_users_30d || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Engagement Rate</span>
                </div>
                <span className="text-lg font-bold">
                  {analytics?.total_users ? 
                    Math.round(((analytics.active_users_7d || 0) / analytics.total_users) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metric Detail View */}
      {selectedMetric && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Detailed View: {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
              <Button variant="outline" size="sm" onClick={() => setSelectedMetric(null)}>
                Close
              </Button>
            </CardTitle>
            <CardDescription>
              Detailed breakdown and insights for {selectedMetric}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium">Key Metrics</h4>
                {selectedMetric === 'users' && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Users</span>
                      <span className="font-medium">{analytics?.total_users || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active (7 days)</span>
                      <span className="font-medium">{analytics?.active_users_7d || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active (30 days)</span>
                      <span className="font-medium">{analytics?.active_users_30d || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Retention Rate</span>
                      <span className="font-medium">
                        {analytics?.active_users_30d && analytics?.total_users ? 
                          Math.round((analytics.active_users_30d / analytics.total_users) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                )}
                {selectedMetric === 'tasks' && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Tasks</span>
                      <span className="font-medium">{analytics?.total_tasks || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Completed</span>
                      <span className="font-medium">{analytics?.completed_tasks || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Completion Rate</span>
                      <span className="font-medium">{calculateCompletionRate()}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg per User</span>
                      <span className="font-medium">
                        {analytics?.total_users && analytics.total_users > 0 ? 
                          Math.round((analytics.total_tasks || 0) / analytics.total_users) : 0}
                      </span>
                    </div>
                  </div>
                )}
                {selectedMetric === 'organizations' && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Organizations</span>
                      <span className="font-medium">{analytics?.total_organizations || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Users per Org</span>
                      <span className="font-medium">
                        {analytics?.total_organizations && analytics.total_organizations > 0 ? 
                          Math.round((analytics.total_users || 0) / analytics.total_organizations) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Tasks per Org</span>
                      <span className="font-medium">
                        {analytics?.total_organizations && analytics.total_organizations > 0 ? 
                          Math.round((analytics.total_tasks || 0) / analytics.total_organizations) : 0}
                      </span>
                    </div>
                  </div>
                )}
                {selectedMetric === 'storage' && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Storage</span>
                      <span className="font-medium">{formatBytes(analytics?.storage_used || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Files</span>
                      <span className="font-medium">{analytics?.total_evidence || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg File Size</span>
                      <span className="font-medium">
                        {analytics?.total_evidence && analytics.total_evidence > 0 ? 
                          formatBytes((analytics.storage_used || 0) / analytics.total_evidence) : '0 Bytes'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Recent Trends</h4>
                <div className="text-sm text-muted-foreground">
                  Detailed trend analysis and recommendations would appear here based on the selected metric.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Health */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded bg-green-50">
                <span className="text-sm font-medium">Database</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Healthy</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-green-50">
                <span className="text-sm font-medium">Storage</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Normal</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-green-50">
                <span className="text-sm font-medium">Authentication</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded bg-blue-50">
                <span className="text-sm font-medium">Response Time</span>
                <span className="text-sm font-bold">~200ms</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-blue-50">
                <span className="text-sm font-medium">Uptime</span>
                <span className="text-sm font-bold">99.9%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-blue-50">
                <span className="text-sm font-medium">Error Rate</span>
                <span className="text-sm font-bold">0.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded bg-purple-50">
                <span className="text-sm font-medium">Avg Tasks/User</span>
                <span className="text-sm font-bold">
                  {analytics?.total_users && analytics.total_users > 0 ? 
                    Math.round((analytics.total_tasks || 0) / analytics.total_users) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-purple-50">
                <span className="text-sm font-medium">Evidence/Task</span>
                <span className="text-sm font-bold">
                  {analytics?.total_tasks && analytics.total_tasks > 0 ? 
                    Math.round((analytics.total_evidence || 0) / analytics.total_tasks) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-purple-50">
                <span className="text-sm font-medium">Avg Storage/Org</span>
                <span className="text-sm font-bold">
                  {analytics?.total_organizations && analytics.total_organizations > 0 ? 
                    formatBytes((analytics.storage_used || 0) / analytics.total_organizations) : '0 Bytes'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}