import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface CustomerRouteProps {
  children: React.ReactNode;
}

export const CustomerRoute = ({ children }: CustomerRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const [isCustomer, setIsCustomer] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCustomerStatus = async () => {
      if (authLoading || !user) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking customer status:', error);
          setIsCustomer(false);
          return;
        }

        // Allow customers and legacy users, but block platform admins
        setIsCustomer(profile?.role !== 'platform_admin');
      } catch (error) {
        console.error('Error in customer guard:', error);
        setIsCustomer(false);
      }
    };

    if (!authLoading) {
      if (!user) {
        setIsCustomer(false);
      } else {
        checkCustomerStatus();
      }
    }
  }, [user, authLoading]);

  // Show loading while auth is loading or we haven't checked role yet
  if (authLoading || isCustomer === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isCustomer) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};