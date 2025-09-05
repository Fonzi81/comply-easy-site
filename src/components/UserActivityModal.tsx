import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Activity, Calendar, LogIn, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface UserActivity {
  activity_date: string;
  login_count: number;
  action_count: number;
  last_action_time: string | null;
}

interface UserActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  userEmail: string | null;
}

export default function UserActivityModal({
  open,
  onOpenChange,
  userId,
  userEmail,
}: UserActivityModalProps) {
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState<UserActivity[]>([]);

  useEffect(() => {
    if (open && userId) {
      loadUserActivity();
    }
  }, [open, userId]);

  const loadUserActivity = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('admin_get_user_activity', {
        target_user_id: userId,
        days_back: 30,
      });

      if (error) throw error;

      setActivity(data || []);
    } catch (error: any) {
      console.error('Error loading user activity:', error);
      toast.error('Failed to load user activity');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM d, yyyy');
  };

  const formatDateTime = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM d, yyyy - h:mm a');
  };

  const getTotalActivity = () => {
    return activity.reduce((sum, day) => sum + day.login_count + day.action_count, 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            User Activity Timeline
          </DialogTitle>
          <DialogDescription>
            Activity history for {userEmail} over the last 30 days
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold">{activity.length}</div>
                <div className="text-sm text-muted-foreground">Active Days</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold">
                  {activity.reduce((sum, day) => sum + day.login_count, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Logins</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold">{getTotalActivity()}</div>
                <div className="text-sm text-muted-foreground">Total Actions</div>
              </div>
            </div>

            <Separator />

            {/* Activity Timeline */}
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {activity.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No activity recorded in the last 30 days
                  </div>
                ) : (
                  activity.map((day) => {
                    const hasActivity = day.login_count > 0 || day.action_count > 0;
                    
                    if (!hasActivity) return null;

                    return (
                      <div
                        key={day.activity_date}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {formatDate(day.activity_date)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {day.login_count > 0 && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <LogIn className="h-3 w-3" />
                              {day.login_count} login{day.login_count !== 1 ? 's' : ''}
                            </Badge>
                          )}
                          
                          {day.action_count > 0 && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {day.action_count} action{day.action_count !== 1 ? 's' : ''}
                            </Badge>
                          )}

                          {day.last_action_time && (
                            <div className="text-xs text-muted-foreground">
                              Last: {format(new Date(day.last_action_time), 'h:mm a')}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            <div className="flex justify-end">
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}