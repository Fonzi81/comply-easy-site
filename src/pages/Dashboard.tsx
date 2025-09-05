import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download,
  Plus,
  Bell,
  Upload,
  TrendingUp
} from "lucide-react";
import AddTaskModal from "@/components/AddTaskModal";
import AuditPackModal from "@/components/AuditPackModal";
import ReminderModal from "@/components/ReminderModal";
import ComplianceCalendar from "@/components/ComplianceCalendar";
import TemplateModal from "@/components/TemplateModal";
import EvidenceManager from "@/components/EvidenceManager";
import EvidenceModal from "@/components/EvidenceModal";
import { OrganizationSetup } from "@/components/OrganizationSetup";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface User {
  username: string;
  name: string;
  role: string;
  loginTime: string;
}

interface ComplianceItem {
  id: string;
  title: string;
  category: 'food-safety' | 'whs' | 'fire-safety' | 'test-tag';
  dueDate: string;
  status: 'completed' | 'overdue' | 'upcoming';
  priority: 'high' | 'medium' | 'low';
}

const Dashboard = () => {
  const { user } = useAuth();
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAuditPackOpen, setIsAuditPackOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [hasOrganization, setHasOrganization] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkOrganizationMembership();
    }
  }, [user]);

  const checkOrganizationMembership = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1);

      if (error) {
        console.error('Error checking organization:', error);
        setHasOrganization(false);
      } else {
        setHasOrganization(data && data.length > 0);
        if (data && data.length > 0) {
          loadComplianceData();
        }
      }
    } catch (error) {
      console.error('Error checking organization membership:', error);
      setHasOrganization(false);
    } finally {
      setLoading(false);
    }
  };

  const loadComplianceData = async () => {
    try {
      // Load real compliance tasks from database
      const { data, error } = await supabase
        .from('compliance_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading tasks:', error);
        return;
      }

      // Convert database format to component format
      const tasks = (data || []).map(task => ({
        id: task.id,
        title: task.title,
        category: task.category as 'food-safety' | 'whs' | 'fire-safety' | 'test-tag',
        dueDate: new Date(task.due_date).toISOString().split('T')[0],
        status: task.status as 'completed' | 'overdue' | 'upcoming',
        priority: task.priority === 3 ? 'high' as const : task.priority === 2 ? 'medium' as const : 'low' as const
      }));

      setComplianceItems(tasks);
    } catch (error) {
      console.error('Error loading compliance data:', error);
    }
  };

  const handleAddTask = (task: ComplianceItem) => {
    const updatedItems = [...complianceItems, task];
    setComplianceItems(updatedItems);
    localStorage.setItem('complianceItems', JSON.stringify(updatedItems));
  };

  const handleAddReminder = (reminder: any) => {
    const existingReminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    const updatedReminders = [...existingReminders, reminder];
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
  };

  const handleTaskStatusChange = (taskId: string, newStatus: 'completed' | 'upcoming' | 'overdue') => {
    const updatedItems = complianceItems.map(item => 
      item.id === taskId ? { ...item, status: newStatus } : item
    );
    setComplianceItems(updatedItems);
    localStorage.setItem('complianceItems', JSON.stringify(updatedItems));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'overdue': return 'destructive';
      case 'upcoming': return 'secondary';
      default: return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food-safety': return '🍽️';
      case 'whs': return '⚠️';
      case 'fire-safety': return '🔥';
      case 'test-tag': return '⚡';
      default: return '📋';
    }
  };

  // Show organization setup for new users
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (hasOrganization === false) {
    return <OrganizationSetup onComplete={() => setHasOrganization(true)} />;
  }

  const completedItems = complianceItems.filter(item => item.status === 'completed');
  const overdue = complianceItems.filter(item => item.status === 'overdue');
  const upcoming = complianceItems.filter(item => item.status === 'upcoming');
  const completionRate = complianceItems.length > 0 ? Math.round((completedItems.length / complianceItems.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your compliance overview
        </p>
      </div>
      {/* Today's Compliance Tasks */}
      <Card>
        <CardHeader className="carbon-bg">
          <CardTitle className="text-carbon-foreground">Today's Compliance Tasks</CardTitle>
          <CardDescription className="text-carbon-foreground/80">
            Tasks due today and overdue items requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {complianceItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getCategoryIcon(item.category)}</div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">Due: {item.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {item.status === 'overdue' && (
                    <Badge className="bg-accent text-accent-foreground">Overdue</Badge>
                  )}
                  {item.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complianceItems.length}</div>
              <p className="text-xs text-muted-foreground">Compliance tasks tracked</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{overdue.length}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{upcoming.length}</div>
              <p className="text-xs text-muted-foreground">Due within 7 days</p>
            </CardContent>
          </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">This quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceItems
                .filter(item => item.status === 'upcoming')
                .slice(0, 4)
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.dueDate}</p>
                    </div>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start bg-primary hover:bg-primary/90" 
              onClick={() => setIsEvidenceOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Evidence
            </Button>
            <Button 
              className="w-full justify-start bg-primary hover:bg-primary/90" 
              onClick={() => setIsAuditPackOpen(true)}
            >
              <Download className="w-4 h-4 mr-2" />
              Generate Audit Pack
            </Button>
            <Button 
              className="w-full justify-start bg-primary hover:bg-primary/90" 
              onClick={() => setIsTemplateOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Import State Pack
            </Button>
          </CardContent>
        </Card>

        {/* Compliance Score Widget */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Score</CardTitle>
            <CardDescription>Overall compliance health</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-muted stroke-current"
                  fill="none"
                  strokeWidth="3"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary stroke-current"
                  fill="none"
                  strokeWidth="3"
                  strokeDasharray={`${completionRate}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{completionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AddTaskModal 
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onAddTask={handleAddTask}
      />
      
      <AuditPackModal 
        open={isAuditPackOpen}
        onOpenChange={setIsAuditPackOpen}
        complianceItems={complianceItems}
      />
      
      <ReminderModal 
        open={isReminderOpen}
        onOpenChange={setIsReminderOpen}
        onAddReminder={handleAddReminder}
      />
      
      <TemplateModal 
        open={isTemplateOpen}
        onOpenChange={setIsTemplateOpen}
      />
      
      <EvidenceModal 
        open={isEvidenceOpen}
        onOpenChange={setIsEvidenceOpen}
      />
    </div>
  );
};

export default Dashboard;