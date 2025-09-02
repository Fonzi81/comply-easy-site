import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  CalendarDays, 
  Filter,
  Download,
  Eye,
  Upload
} from "lucide-react";

interface CalendarTask {
  id: string;
  title: string;
  category: 'Food Safety' | 'WHS' | 'Fire Safety' | 'Test & Tag';
  dueDate: string;
  status: 'Due' | 'Overdue' | 'Completed';
  description: string;
}

const CalendarView = () => {
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null);

  useEffect(() => {
    // Sample calendar tasks
    const sampleTasks: CalendarTask[] = [
      {
        id: '1',
        title: 'Temperature Log Review',
        category: 'Food Safety',
        dueDate: '2024-01-15',
        status: 'Due',
        description: 'Review and verify all temperature logs for refrigeration units'
      },
      {
        id: '2',
        title: 'Fire Extinguisher Inspection',
        category: 'Fire Safety',
        dueDate: '2024-01-10',
        status: 'Overdue',
        description: 'Monthly inspection of all fire extinguishers'
      },
      {
        id: '3',
        title: 'Staff Safety Training',
        category: 'WHS',
        dueDate: '2024-01-20',
        status: 'Due',
        description: 'Quarterly workplace health and safety training session'
      },
      {
        id: '4',
        title: 'Equipment PAT Testing',
        category: 'Test & Tag',
        dueDate: '2024-01-25',
        status: 'Due',
        description: 'Portable appliance testing for all electrical equipment'
      }
    ];
    setTasks(sampleTasks);
  }, []);

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => {
      const matchesDate = task.dueDate === dateStr;
      const matchesCategory = categoryFilter === "all" || task.category === categoryFilter;
      return matchesDate && matchesCategory;
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Food Safety':
        return 'bg-blue-500';
      case 'WHS':
        return 'bg-orange-500';
      case 'Fire Safety':
        return 'bg-red-500';
      case 'Test & Tag':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600';
      case 'Overdue':
        return 'text-red-600';
      case 'Due':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const generateICSFile = () => {
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ComplyEasy//Compliance Calendar//EN
`;

    tasks.forEach(task => {
      const dueDate = new Date(task.dueDate);
      const formattedDate = dueDate.toISOString().replace(/[-:]/g, '').split('T')[0] + 'T120000Z';
      
      icsContent += `BEGIN:VEVENT
UID:${task.id}@complyeasy.com
DTSTART:${formattedDate}
SUMMARY:${task.title}
DESCRIPTION:${task.description}
CATEGORIES:${task.category}
STATUS:${task.status === 'Completed' ? 'CONFIRMED' : 'TENTATIVE'}
END:VEVENT
`;
    });

    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'compliance-calendar.ics';
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage compliance tasks by date
          </p>
        </div>
        <Button onClick={generateICSFile} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Calendar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters & Controls */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">View</label>
                <Select value={viewMode} onValueChange={(value: 'month' | 'week') => setViewMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Month View</SelectItem>
                    <SelectItem value="week">Week View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Food Safety">Food Safety</SelectItem>
                    <SelectItem value="WHS">WHS</SelectItem>
                    <SelectItem value="Fire Safety">Fire Safety</SelectItem>
                    <SelectItem value="Test & Tag">Test & Tag</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setCategoryFilter("all")}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm">Scheduled</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="text-sm">Overdue</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Completed</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="carbon-bg">
            <CardHeader>
              <CardTitle className="text-carbon-foreground">
                {viewMode === 'month' ? 'Monthly View' : 'Weekly View'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border bg-card"
              />
            </CardContent>
          </Card>
        </div>

        {/* Task List for Selected Date */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate ? selectedDate.toDateString() : 'Select a date'}
              </CardTitle>
              <CardDescription>
                Tasks scheduled for this date
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDate && (
                <div className="space-y-3">
                  {getTasksForDate(selectedDate).map((task) => (
                    <Sheet key={task.id}>
                      <SheetTrigger asChild>
                        <div 
                          className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setSelectedTask(task)}
                        >
                          <div className="flex items-start space-x-2">
                            <div 
                              className={`w-3 h-3 rounded-full mt-2 ${getCategoryColor(task.category)}`}
                            ></div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{task.title}</p>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getStatusColor(task.status)}`}
                              >
                                {task.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>{task.title}</SheetTitle>
                          <SheetDescription>
                            {task.category} • Due {task.dueDate}
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Description</h4>
                            <p className="text-sm text-muted-foreground">
                              {task.description}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Status</h4>
                            <Badge variant={task.status === 'Completed' ? 'default' : task.status === 'Overdue' ? 'destructive' : 'secondary'}>
                              {task.status}
                            </Badge>
                          </div>

                          <div className="space-y-2 pt-4 border-t">
                            <Button className="w-full" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button className="w-full" variant="outline">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Evidence
                            </Button>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  ))}
                  
                  {getTasksForDate(selectedDate).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No tasks scheduled for this date
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;