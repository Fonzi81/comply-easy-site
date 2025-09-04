-- Insert sample session data for the current user to show activity
-- This will create some login sessions for the last few days to show in analytics

INSERT INTO public.user_sessions (user_id, login_time, ip_address, user_agent)
VALUES 
  -- Current user (you) with recent login activity
  ('d14bcef3-9378-4271-91cf-bfeb0bba16e5', now() - interval '1 hour', '127.0.0.1', 'Mozilla/5.0 (Chrome)'),
  ('d14bcef3-9378-4271-91cf-bfeb0bba16e5', now() - interval '1 day', '127.0.0.1', 'Mozilla/5.0 (Chrome)'),
  ('d14bcef3-9378-4271-91cf-bfeb0bba16e5', now() - interval '3 days', '127.0.0.1', 'Mozilla/5.0 (Chrome)'),
  ('d14bcef3-9378-4271-91cf-bfeb0bba16e5', now() - interval '5 days', '127.0.0.1', 'Mozilla/5.0 (Chrome)')
ON CONFLICT DO NOTHING;

-- Also insert some activity logs
INSERT INTO public.user_activity_logs (user_id, action, resource_type, created_at)
VALUES 
  ('d14bcef3-9378-4271-91cf-bfeb0bba16e5', 'view_analytics', 'dashboard', now() - interval '1 hour'),
  ('d14bcef3-9378-4271-91cf-bfeb0bba16e5', 'login', 'auth', now() - interval '1 day'),
  ('d14bcef3-9378-4271-91cf-bfeb0bba16e5', 'view_dashboard', 'dashboard', now() - interval '2 days'),
  ('d14bcef3-9378-4271-91cf-bfeb0bba16e5', 'login', 'auth', now() - interval '3 days')
ON CONFLICT DO NOTHING;