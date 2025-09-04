import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Users, Search, UserPlus, Shield, Pencil, Mail } from "lucide-react";
import { UserEditModal } from "@/components/UserEditModal";
import { UserProfile } from "@/types/user";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

// Extended interface for admin user list that includes email
interface AdminUserProfile extends UserProfile {
  email: string;
}

const UserManagement = () => {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminGuard();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (isAdmin && !adminLoading) {
      loadUsers();
    }
  }, [isAdmin, adminLoading]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Debug: Check current user session
      const { data: session } = await supabase.auth.getSession();
      console.log('Current session:', session);
      console.log('Current user:', user);
      
      // Use the secure RPC function that checks admin permissions
      const { data: users, error } = await supabase.rpc('admin_list_users');

      console.log('RPC Response:', { users, error });

      if (error) {
        throw error;
      }

      // Type assertion for the RPC return data
      const typedUsers = (users || []) as unknown as AdminUserProfile[];
      setUsers(typedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleUserUpdated = () => {
    loadUsers();
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const getInitials = (fullName: string | null | undefined, email: string) => {
    if (fullName && fullName.trim()) {
      const names = fullName.trim().split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
      }
      return fullName.charAt(0).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive text-destructive-foreground';
      case 'user':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = user.full_name?.toLowerCase() || '';
    const email = user.email?.toLowerCase() || '';
    
    return fullName.includes(searchLower) || 
           email.includes(searchLower) ||
           user.role.toLowerCase().includes(searchLower);
  });

  // Show loading while checking admin status
  if (adminLoading || !isAdmin) {
    return null; // useAdminGuard will handle redirects
  }

  const renderUserList = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              </div>
              <div className="h-6 bg-muted rounded animate-pulse w-16" />
              <div className="h-8 bg-muted rounded animate-pulse w-20" />
            </div>
          ))}
        </div>
      );
    }

    if (filteredUsers.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No users found</h3>
          <p className="text-muted-foreground">
            No users match your search criteria.
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.full_name, user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user.full_name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ID: {user.id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Mail className="w-3 h-3 mr-2 text-muted-foreground" />
                    {user.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role === 'admin' ? (
                      <Shield className="w-3 h-3 mr-1" />
                    ) : (
                      <Users className="w-3 h-3 mr-1" />
                    )}
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditUser(user)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Admin: User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button disabled>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Users
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'admin').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'user').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and User List */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderUserList()}
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <UserEditModal
        user={selectedUser}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
};

export default UserManagement;