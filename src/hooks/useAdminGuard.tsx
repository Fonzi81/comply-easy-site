import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const useAdminGuard = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authLoading) return;
      
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data: hasAccess, error } = await supabase
          .rpc('has_permission', { perm: 'admin.portal.access' });

        if (error) {
          console.error('Error checking admin status:', error);
          navigate('/dashboard');
          return;
        }

        setIsAdmin(!!hasAccess);

        if (!hasAccess) {
          navigate('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Error in admin guard:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, authLoading, navigate]);

  return { isAdmin, loading: loading || authLoading };
};

// Hook for checking specific permissions
export const usePermissions = () => {
  const { user } = useAuth();
  
  const checkPermission = async (permission: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .rpc('has_permission', { perm: permission });
      
      if (error) {
        console.error('Permission check error:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  };

  return { checkPermission };
};