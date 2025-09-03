// Unified user interface that matches our new database schema
export interface UserProfile {
  id: string;
  full_name?: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}