import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface CustomerRouteProps {
  children: React.ReactNode;
}

export const CustomerRoute = ({ children }: CustomerRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const [isCustomer, setIsCustomer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCustomerStatus = async () => {
      if (authLoading) return;
      
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking customer status:', error);
          setLoading(false);
          return;
        }

        // Allow customers and legacy users, but redirect platform admins to admin portal
        if (profile?.role === 'platform_admin') {
          setIsCustomer(false);
        } else {
          setIsCustomer(profile?.role === 'customer' || profile?.role === 'user');
        }
      } catch (error) {
        console.error('Error in customer guard:', error);
      } finally {
        setLoading(false);
      }
    };

    checkCustomerStatus();
  }, [user, authLoading]);

  if (loading || authLoading) {
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