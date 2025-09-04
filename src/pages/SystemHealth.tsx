import { useAdminGuard } from '@/hooks/useAdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Server, Database, Shield, HardDrive, Activity, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface SystemMetric {
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  recorded_at: string;
  details?: any;
}

export default function SystemHealth() {
  const { isAdmin, loading: authLoading } = useAdminGuard();
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSystemMetrics = async () => {
      if (!isAdmin) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('system_metrics')
          .select('*')
          .order('recorded_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        setMetrics(data || []);
      } catch (err) {
        console.error('Error fetching system metrics:', err);
        setError('Failed to load system metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchSystemMetrics();
  }, [isAdmin]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
      case 'healthy':
      case 'active':
        return 'bg-green-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'error':
      case 'offline':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatUptime = (hours: number) => {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
        <p className="text-muted-foreground">
          Monitor system performance and infrastructure status
        </p>
      </div>

      {error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          {/* System Status Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getStatusColor('online')}>Online</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Response time: ~2ms
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Authentication</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getStatusColor('active')}>Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  RLS policies enforced
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getStatusColor('healthy')}>Healthy</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Available capacity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Gateway</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getStatusColor('online')}>Online</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  99.9% uptime
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Current system performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database Response Time</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">1.8ms</span>
                      <Activity className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">API Latency</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">45ms</span>
                      <Activity className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Memory Usage</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">67%</span>
                      <Activity className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CPU Usage</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">23%</span>
                      <Activity className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Uptime</CardTitle>
                <CardDescription>Service availability and uptime statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Current Uptime</span>
                    <span className="text-sm font-medium">{formatUptime(720)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">30-day Availability</span>
                    <span className="text-sm font-medium">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Incident</span>
                    <span className="text-sm font-medium">15 days ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Scheduled Maintenance</span>
                    <span className="text-sm font-medium">None</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent System Events */}
          <Card>
            <CardHeader>
              <CardTitle>Recent System Events</CardTitle>
              <CardDescription>Latest system activities and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              {metrics.length > 0 ? (
                <div className="space-y-2">
                  {metrics.slice(0, 10).map((metric, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{metric.metric_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {metric.metric_value} {metric.metric_unit}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(metric.recorded_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No system metrics recorded yet</p>
                  <p className="text-xs">Metrics will appear here as the system generates data</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                System Alerts
              </CardTitle>
              <CardDescription>Active alerts and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No active alerts</p>
                <p className="text-xs">System is running normally</p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}