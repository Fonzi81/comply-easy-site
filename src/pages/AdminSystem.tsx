import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Database, Activity, AlertTriangle, CheckCircle, Clock, Server, HardDrive, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SystemHealth {
  database_connections: number;
  active_sessions: number;
  storage_usage: number;
  error_count: number;
  uptime: string;
  response_time: number;
}

interface RecentError {
  id: string;
  error_message: string;
  created_at: string;
  severity: string;
}

export default function AdminSystem() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [recentErrors, setRecentErrors] = useState<RecentError[]>([]);
  const [loading, setLoading] = useState(true);
  const [systemLoading, setSystemLoading] = useState(true);

  useEffect(() => {
    loadSystemHealth();
    loadRecentErrors();
    
    // Set up periodic refresh
    const interval = setInterval(() => {
      loadSystemHealth();
      loadRecentErrors();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadSystemHealth = async () => {
    try {
      // Get basic system metrics
      const { data: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { data: orgCount } = await supabase
        .from('organizations')
        .select('*', { count: 'exact', head: true });

      const { data: taskCount } = await supabase
        .from('compliance_tasks')
        .select('*', { count: 'exact', head: true });

      const { data: evidenceData } = await supabase
        .from('evidence')
        .select('file_size');

      const totalStorage = evidenceData?.reduce((sum, item) => sum + (item.file_size || 0), 0) || 0;

      // Mock system health data (in a real app, this would come from monitoring APIs)
      setSystemHealth({
        database_connections: Math.floor(Math.random() * 50) + 10,
        active_sessions: Math.floor(Math.random() * 20) + 5,
        storage_usage: totalStorage,
        error_count: Math.floor(Math.random() * 5),
        uptime: '99.9%',
        response_time: Math.floor(Math.random() * 100) + 150,
      });
    } catch (error) {
      console.error('Error loading system health:', error);
      toast.error('Failed to load system health data');
    } finally {
      setSystemLoading(false);
    }
  };

  const loadRecentErrors = async () => {
    try {
      // In a real application, you would query actual error logs
      // For now, we'll use mock data
      const mockErrors: RecentError[] = [
        {
          id: '1',
          error_message: 'Failed to upload evidence file - file too large',
          created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          severity: 'warning'
        },
        {
          id: '2',
          error_message: 'Database connection timeout',
          created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          severity: 'error'
        },
        {
          id: '3',
          error_message: 'Authentication token expired',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          severity: 'info'
        }
      ];
      
      setRecentErrors(mockErrors);
    } catch (error) {
      console.error('Error loading recent errors:', error);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };

  const getHealthStatus = () => {
    if (!systemHealth) return { status: 'unknown', color: 'secondary' };
    
    if (systemHealth.error_count > 10 || systemHealth.response_time > 500) {
      return { status: 'critical', color: 'destructive' };
    } else if (systemHealth.error_count > 5 || systemHealth.response_time > 300) {
      return { status: 'warning', color: 'secondary' };
    } else {
      return { status: 'healthy', color: 'default' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const healthStatus = getHealthStatus();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
        <p className="text-muted-foreground">
          Monitor system performance and infrastructure status
        </p>
      </div>

      {/* System Status Overview */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant={healthStatus.color === 'destructive' ? 'destructive' : 
                              healthStatus.color === 'secondary' ? 'secondary' : 'default'}>
                {healthStatus.status.toUpperCase()}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Overall system health
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth?.response_time || 0}ms</div>
            <p className="text-xs text-muted-foreground">
              Average API response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth?.active_sessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Current user sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(systemHealth?.storage_usage || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Total storage used
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Database Health</CardTitle>
            <CardDescription>Database connection and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Active Connections</span>
                </div>
                <span className="font-medium">{systemHealth?.database_connections || 0}/100</span>
              </div>
              <Progress value={(systemHealth?.database_connections || 0)} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Uptime</span>
                </div>
                <span className="font-medium">{systemHealth?.uptime || '0%'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Query Performance</span>
                </div>
                <span className="font-medium">Optimal</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Monitoring</CardTitle>
            <CardDescription>Recent system errors and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Recent Errors</span>
                <Badge variant={systemHealth?.error_count && systemHealth.error_count > 5 ? 'destructive' : 'outline'}>
                  {systemHealth?.error_count || 0}
                </Badge>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recentErrors.map((error) => (
                  <div key={error.id} className="border rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant={getSeverityColor(error.severity)}>
                        {error.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(error.created_at)}
                      </span>
                    </div>
                    <p className="text-sm">{error.error_message}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Infrastructure Status */}
      <Card>
        <CardHeader>
          <CardTitle>Infrastructure Status</CardTitle>
          <CardDescription>Core system components and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Database className="h-4 w-4" />
                Database
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Status</span>
                  <Badge>Online</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Version</span>
                  <span className="text-muted-foreground">PostgreSQL 15</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Connections</span>
                  <span className="text-muted-foreground">{systemHealth?.database_connections || 0}/100</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Server className="h-4 w-4" />
                API Server
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Status</span>
                  <Badge>Healthy</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Response Time</span>
                  <span className="text-muted-foreground">{systemHealth?.response_time || 0}ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Requests/min</span>
                  <span className="text-muted-foreground">~150</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Storage
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Status</span>
                  <Badge>Normal</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Used Space</span>
                  <span className="text-muted-foreground">{formatBytes(systemHealth?.storage_usage || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Files</span>
                  <span className="text-muted-foreground">Available</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}