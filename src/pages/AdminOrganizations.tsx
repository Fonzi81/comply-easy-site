import { useAdminGuard } from '@/hooks/useAdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Loader2, MoreHorizontal, Building2, Users, CheckCircle, FileText, Calendar, Search, TrendingUp, Database } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Organization {
  org_id: string;
  org_name: string;
  member_count: number;
  task_count: number;
  completed_tasks: number;
  evidence_count: number;
  storage_used: number;
  created_at: string;
  last_activity: string;
}

export default function AdminOrganizations() {
  const { isAdmin, loading } = useAdminGuard();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([]);
  const [orgsLoading, setOrgsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadOrganizations();
    }
  }, [isAdmin]);

  useEffect(() => {
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const filtered = organizations.filter(org => 
        org.org_name.toLowerCase().includes(search)
      );
      setFilteredOrganizations(filtered);
    } else {
      setFilteredOrganizations(organizations);
    }
  }, [organizations, searchTerm]);

  const loadOrganizations = async () => {
    try {
      setOrgsLoading(true);
      const { data, error } = await supabase.rpc('admin_get_organization_analytics');

      if (error) throw error;

      setOrganizations(data || []);
    } catch (error: any) {
      console.error('Error loading organizations:', error);
      toast.error('Failed to load organizations');
    } finally {
      setOrgsLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompletionRate = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const getActivityStatus = (lastActivity: string) => {
    const daysSince = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince <= 1) return { label: 'Very Active', color: 'bg-green-500' };
    if (daysSince <= 7) return { label: 'Active', color: 'bg-blue-500' };
    if (daysSince <= 30) return { label: 'Moderate', color: 'bg-yellow-500' };
    return { label: 'Inactive', color: 'bg-gray-500' };
  };

  const getTotalStats = () => {
    return organizations.reduce(
      (acc, org) => ({
        totalMembers: acc.totalMembers + org.member_count,
        totalTasks: acc.totalTasks + org.task_count,
        totalCompleted: acc.totalCompleted + org.completed_tasks,
        totalStorage: acc.totalStorage + org.storage_used,
      }),
      { totalMembers: 0, totalTasks: 0, totalCompleted: 0, totalStorage: 0 }
    );
  };

  if (loading || !isAdmin) return null;

  const stats = getTotalStats();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Organization Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage organization usage and performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getCompletionRate(stats.totalCompleted, stats.totalTasks)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCompleted} of {stats.totalTasks} tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(stats.totalStorage)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardHeader>

        <CardContent>
          {orgsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrganizations.map((org) => {
                    const completionRate = getCompletionRate(org.completed_tasks, org.task_count);
                    const activityStatus = getActivityStatus(org.last_activity);
                    
                    return (
                      <TableRow key={org.org_id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{org.org_name}</p>
                            <p className="text-sm text-muted-foreground">
                              Created {formatDistanceToNow(new Date(org.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                            {org.member_count}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                            {org.task_count}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{completionRate}%</span>
                              <span className="text-muted-foreground">
                                {org.completed_tasks}/{org.task_count}
                              </span>
                            </div>
                            <Progress value={completionRate} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Database className="mr-2 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{formatBytes(org.storage_used)}</p>
                              <p className="text-xs text-muted-foreground">
                                {org.evidence_count} files
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className={`h-2 w-2 rounded-full ${activityStatus.color}`} />
                            <span className="text-sm">{activityStatus.label}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <TrendingUp className="mr-2 h-4 w-4" />
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                Manage Members
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                View Tasks
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {filteredOrganizations.length === 0 && !orgsLoading && (
                <div className="text-center py-12">
                  <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No organizations found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No organizations match your search.' : 'No organizations have been created yet.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}