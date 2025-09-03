# Admin User Setup Guide

This application uses a role-based access system where admins must be created manually in the Supabase backend, not through the application interface.

## User Roles

- **Users**: Regular business users who sign up through the application
- **Managers**: Business users with elevated permissions (can be assigned through the app)
- **Admins**: System administrators with full access (must be created manually in Supabase)

## Creating Admin Users

Admins can only be created by directly modifying the Supabase database. Follow these steps:

### Method 1: Through Supabase Dashboard

1. **Access Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor

2. **Create Admin User**
   ```sql
   -- First, create the user through Supabase Auth or let them sign up normally
   -- Then update their role to admin:
   
   -- Find the user's ID (replace 'admin@example.com' with actual email)
   SELECT id FROM auth.users WHERE email = 'admin@example.com';
   
   -- Update their role to admin (replace 'user_id_here' with actual user ID)
   UPDATE public.user_roles 
   SET role = 'admin' 
   WHERE user_id = 'user_id_here';
   ```

3. **Verify Admin Creation**
   ```sql
   -- Check if the admin role was assigned correctly
   SELECT p.email, ur.role 
   FROM public.profiles p
   JOIN public.user_roles ur ON p.user_id = ur.user_id
   WHERE ur.role = 'admin';
   ```

### Method 2: Direct Database Access

If you have direct database access:

```sql
-- Insert admin role for existing user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('existing_user_id', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

## Admin Privileges

Once a user has admin role, they will have access to:

- User Management interface
- View all user profiles and organizations
- Modify user roles (except other admins)
- Access administrative functions
- View compliance data across all organizations

## Security Notes

- Admin roles cannot be created or modified through the application interface
- Admin users cannot have their admin status revoked through the app
- Only database-level access can create or remove admin privileges
- This ensures proper security controls for administrative access

## Troubleshooting

- If an admin user doesn't see admin functions, check their role in the `user_roles` table
- Ensure RLS policies are working correctly by testing with a non-admin account
- Clear browser cache if admin interface doesn't appear after role assignment