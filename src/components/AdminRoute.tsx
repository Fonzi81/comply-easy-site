import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const [isPlatformAdmin, setIsPlatformAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authLoading || !user) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsPlatformAdmin(false);
          return;
        }

        setIsPlatformAdmin(profile?.role === 'platform_admin');
      } catch (error) {
        console.error('Error in admin guard:', error);
        setIsPlatformAdmin(false);
      }
    };

    if (!authLoading) {
      if (!user) {
        setIsPlatformAdmin(false);
      } else {
        checkAdminStatus();
      }
    }
  }, [user, authLoading]);

  // Show loading while auth is loading or we haven't checked role yet
  if (authLoading || isPlatformAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isPlatformAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};