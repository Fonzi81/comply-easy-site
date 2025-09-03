import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Save, X, Shield } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UserProfile } from "@/types/user";

interface UserEditModalProps {
  user: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

export const UserEditModal = ({ user, open, onOpenChange, onUserUpdated }: UserEditModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    role: 'user' as 'admin' | 'user'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        role: user.role
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name || null,
          role: formData.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      onUserUpdated();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <span>Edit User</span>
              <div className="text-sm text-muted-foreground font-normal">
                ID: {user.id.slice(0, 8)}...
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Update user profile information and permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* User Info */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>Joined {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</span>
            </div>
            <Badge className={user.role === 'admin' ? 'bg-destructive text-destructive-foreground' : 'bg-secondary text-secondary-foreground'}>
              {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
              {user.role}
            </Badge>
          </div>

          {/* Form Fields */}
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Enter full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            {user?.role === 'admin' ? (
              <div className="flex items-center p-3 bg-muted rounded-lg">
                <Shield className="w-4 h-4 mr-2 text-destructive" />
                <span className="font-medium text-destructive">Administrator</span>
                <Badge className="ml-2 bg-destructive text-destructive-foreground">
                  Cannot be modified
                </Badge>
              </div>
            ) : (
              <Select 
                value={formData.role} 
                onValueChange={(value: 'user') => setFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      User
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};