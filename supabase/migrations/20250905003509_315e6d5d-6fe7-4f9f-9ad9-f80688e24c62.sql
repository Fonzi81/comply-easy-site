-- Phase 2.1a: Add new role enum values first
ALTER TYPE user_role ADD VALUE 'platform_admin';
ALTER TYPE user_role ADD VALUE 'customer';