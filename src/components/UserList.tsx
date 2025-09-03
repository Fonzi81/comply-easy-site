import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Shield, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UserProfile } from "@/types/user";

interface UserListProps {
  users: UserProfile[];
  loading: boolean;
  onEditUser: (user: UserProfile) => void;
}

export const UserList = ({ users, loading, onEditUser }: UserListProps) => {
  const getInitials = (fullName: string | null | undefined) => {
    if (fullName && fullName.trim()) {
      const names = fullName.trim().split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
      }
      return fullName.charAt(0).toUpperCase();
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

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
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
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.full_name)}
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
                <Badge className={getRoleColor(user.role)}>
                  {user.role === 'admin' ? (
                    <Shield className="w-3 h-3 mr-1" />
                  ) : (
                    <User className="w-3 h-3 mr-1" />
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
                  onClick={() => onEditUser(user)}
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