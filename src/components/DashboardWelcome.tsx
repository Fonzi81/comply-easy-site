import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckSquare, Calendar, FileImage, Package, Plus } from 'lucide-react';

export const DashboardWelcome = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: "Create Task",
      description: "Add a new compliance task",
      icon: Plus,
      href: "/tasks",
      action: "create"
    },
    {
      title: "View Calendar",
      description: "Check upcoming deadlines",
      icon: Calendar,
      href: "/calendar"
    },
    {
      title: "Upload Evidence",
      description: "Add compliance documentation",
      icon: FileImage,
      href: "/evidence"
    },
    {
      title: "Generate Audit Pack",
      description: "Create compliance report",
      icon: Package,
      href: "/audit-pack"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.user_metadata?.first_name || user?.email?.split('@')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here's your compliance overview for today
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Card key={action.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {action.title}
              </CardTitle>
              <action.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">
                {action.description}
              </CardDescription>
              <Link to={action.href}>
                <Button size="sm" className="w-full">
                  {action.action === "create" ? "Create" : "View"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Recent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Fire extinguisher check</span>
                <span className="text-orange-600">Due in 3 days</span>
              </div>
              <div className="flex justify-between">
                <span>Staff food safety training</span>
                <span className="text-green-600">Completed</span>
              </div>
              <div className="flex justify-between">
                <span>Temperature log review</span>
                <span className="text-red-600">Overdue</span>
              </div>
            </div>
            <Link to="/tasks">
              <Button variant="outline" size="sm" className="w-full mt-4">
                View All Tasks
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Monthly WHS review</span>
                <span>Jan 15</span>
              </div>
              <div className="flex justify-between">
                <span>Food safety audit</span>
                <span>Jan 22</span>
              </div>
              <div className="flex justify-between">
                <span>Fire drill</span>
                <span>Feb 1</span>
              </div>
            </div>
            <Link to="/calendar">
              <Button variant="outline" size="sm" className="w-full mt-4">
                View Calendar
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Evidence Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Documents uploaded</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span>Pending review</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span>Approved</span>
                <span className="font-medium">21</span>
              </div>
            </div>
            <Link to="/evidence">
              <Button variant="outline" size="sm" className="w-full mt-4">
                Manage Evidence
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};