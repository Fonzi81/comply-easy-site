import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  LogOut, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download,
  Plus,
  Settings
} from "lucide-react";

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
  const [user, setUser] = useState<User | null>(null);
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));

    // Initialize sample compliance data
    const sampleData: ComplianceItem[] = [
      {
        id: '1',
        title: 'Temperature Log Review',
        category: 'food-safety',
        dueDate: '2024-01-15',
        status: 'upcoming',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Fire Extinguisher Inspection',
        category: 'fire-safety',
        dueDate: '2024-01-10',
        status: 'overdue',
        priority: 'high'
      },
      {
        id: '3',
        title: 'Staff Safety Training',
        category: 'whs',
        dueDate: '2024-01-20',
        status: 'upcoming',
        priority: 'medium'
      },
      {
        id: '4',
        title: 'Equipment Testing',
        category: 'test-tag',
        dueDate: '2024-01-05',
        status: 'completed',
        priority: 'medium'
      }
    ];

    const stored = localStorage.getItem('complianceItems');
    if (stored) {
      setComplianceItems(JSON.parse(stored));
    } else {
      setComplianceItems(sampleData);
      localStorage.setItem('complianceItems', JSON.stringify(sampleData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
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

  const completedItems = complianceItems.filter(item => item.status === 'completed');
  const overdue = complianceItems.filter(item => item.status === 'overdue');
  const upcoming = complianceItems.filter(item => item.status === 'upcoming');
  const completionRate = Math.round((completedItems.length / complianceItems.length) * 100);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-heading font-bold">ComplyEasy</h1>
              </div>
              <Badge variant="secondary">Dashboard</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium">Completion</CardTitle>
              <CheckCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{completionRate}%</div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="food-safety">Food Safety</TabsTrigger>
            <TabsTrigger value="whs">WHS</TabsTrigger>
            <TabsTrigger value="fire-safety">Fire Safety</TabsTrigger>
            <TabsTrigger value="test-tag">Test & Tag</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest compliance updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceItems.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="text-2xl">{getCategoryIcon(item.category)}</div>
                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">Due: {item.dueDate}</p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {item.status}
                        </Badge>
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
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Compliance Task
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Audit Pack
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Reminder
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Compliance Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {['food-safety', 'whs', 'fire-safety', 'test-tag'].map((category) => (
            <TabsContent key={category} value={category}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">{getCategoryIcon(category)}</span>
                    <span className="capitalize">{category.replace('-', ' ')} Compliance</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your {category.replace('-', ' ')} compliance requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceItems
                      .filter(item => item.category === category)
                      .map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">Due: {item.dueDate}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'}>
                              {item.priority}
                            </Badge>
                            <Badge variant={getStatusBadgeVariant(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    
                    {complianceItems.filter(item => item.category === category).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No {category.replace('-', ' ')} items yet</p>
                        <Button variant="outline" className="mt-4">
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Item
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;