import { useState, useEffect } from 'react';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Role {
  id: string;
  key: string;
  label: string;
  permission_count: number;
}

interface Permission {
  id: string;
  key: string;
  description: string;
}

interface RolePermission {
  role_id: string;
  permission_id: string;
}

export default function RoleManagement() {
  const { isAdmin, loading: adminLoading } = useAdminGuard();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      const [rolesResult, permissionsResult, rolePermsResult] = await Promise.all([
        supabase.rpc('admin_get_roles'),
        supabase.rpc('admin_get_permissions'),
        supabase.from('role_permissions').select('role_id, permission_id')
      ]);

      if (rolesResult.error) throw rolesResult.error;
      if (permissionsResult.error) throw permissionsResult.error;
      if (rolePermsResult.error) throw rolePermsResult.error;

      setRoles(rolesResult.data || []);
      setPermissions(permissionsResult.data || []);
      setRolePermissions(rolePermsResult.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load roles and permissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = async (roleKey: string, permKey: string, hasPermission: boolean) => {
    const updateKey = `${roleKey}-${permKey}`;
    setUpdating(updateKey);

    try {
      if (hasPermission) {
        const { error } = await supabase.rpc('admin_revoke_permission', {
          role_key: roleKey,
          perm_key: permKey
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.rpc('admin_assign_permission', {
          role_key: roleKey,
          perm_key: permKey
        });
        if (error) throw error;
      }

      await loadData(); // Refresh data
      toast({
        title: "Success",
        description: `Permission ${hasPermission ? 'revoked' : 'assigned'} successfully`,
      });
    } catch (error) {
      console.error('Error updating permission:', error);
      toast({
        title: "Error",
        description: "Failed to update permission",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const hasRolePermission = (roleId: string, permissionId: string): boolean => {
    return rolePermissions.some(rp => rp.role_id === roleId && rp.permission_id === permissionId);
  };

  if (adminLoading || loading) {
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
        <h1 className="text-3xl font-bold tracking-tight">Role & Permission Management</h1>
        <p className="text-muted-foreground">
          Manage roles and their associated permissions across the system
        </p>
      </div>

      <div className="grid gap-6">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {role.label}
                    <Badge variant="secondary">{role.key}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {role.permission_count} permission{role.permission_count !== 1 ? 's' : ''} assigned
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {permissions.map((permission) => {
                  const hasPermission = hasRolePermission(role.id, permission.id);
                  const updateKey = `${role.key}-${permission.key}`;
                  const isUpdating = updating === updateKey;

                  return (
                    <div key={permission.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                      <Checkbox
                        id={`${role.key}-${permission.key}`}
                        checked={hasPermission}
                        disabled={isUpdating}
                        onCheckedChange={() => togglePermission(role.key, permission.key, hasPermission)}
                      />
                      <div className="grid gap-1.5 leading-none flex-1">
                        <label
                          htmlFor={`${role.key}-${permission.key}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {permission.key}
                          {isUpdating && <Loader2 className="h-3 w-3 animate-spin inline ml-2" />}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}