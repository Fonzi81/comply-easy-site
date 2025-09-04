import { useAdminGuard } from '@/hooks/useAdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Shield, Settings, BarChart3 } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdminGuard();

  if (loading) {
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
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, roles, and system settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              User Management
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Manage user accounts, roles, and permissions
            </CardDescription>
            <Link to="/admin/users">
              <Button size="sm" className="w-full">
                Manage Users
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Role Management
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Configure roles and their associated permissions
            </CardDescription>
            <Link to="/admin/roles">
              <Button size="sm" className="w-full">
                Manage Roles
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              System Settings
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Configure system-wide settings and preferences
            </CardDescription>
            <Link to="/settings">
              <Button size="sm" className="w-full" variant="outline">
                System Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">User Actions</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>• Create and manage user accounts</div>
                  <div>• Assign and modify user roles</div>
                  <div>• Monitor user activity</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">System Actions</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>• Configure role permissions</div>
                  <div>• Manage system templates</div>
                  <div>• Review audit logs</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}