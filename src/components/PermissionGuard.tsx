import { useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/useAdminGuard';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface PermissionGuardProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard = ({ permission, children, fallback = null }: PermissionGuardProps) => {
  const { user } = useAuth();
  const { checkPermission } = usePermissions();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      checkPermission(permission).then(setHasPermission);
    } else {
      setHasPermission(false);
    }
  }, [user, permission, checkPermission]);

  if (hasPermission === null) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};