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
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking admin status:', error);
          navigate('/dashboard');
          return;
        }

        const adminStatus = profile?.role === 'admin';
        setIsAdmin(adminStatus);

        if (!adminStatus) {
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