import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  CheckSquare, 
  Upload, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Eye
} from "lucide-react";
import TaskDetailModal from "@/components/TaskDetailModal";
import { useToast } from "@/hooks/use-toast";

interface ComplianceTask {
  id: string;
  title: string;
  category: 'Food Safety' | 'WHS' | 'Fire Safety' | 'Test & Tag';
  dueDate: string;
  status: 'Due' | 'Overdue' | 'Completed';
  evidenceAttached: boolean;
  assignedTo: string;
  description?: string;
  priority?: 'High' | 'Medium' | 'Low';
  notes?: string;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<ComplianceTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<ComplianceTask[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<ComplianceTask | null>(null);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Sample task data with enhanced details
    const sampleTasks: ComplianceTask[] = [
      {
        id: '1',
        title: 'Temperature Log Review',
        category: 'Food Safety',
        dueDate: '2024-01-15',
        status: 'Due',
        evidenceAttached: false,
        assignedTo: 'John Smith',
        description: 'Review and verify all temperature logs for refrigeration units. Ensure all readings are within safe ranges and document any anomalies.',
        priority: 'High',
        notes: ''
      },
      {
        id: '2',
        title: 'Fire Extinguisher Inspection',
        category: 'Fire Safety',
        dueDate: '2024-01-10',
        status: 'Overdue',
        evidenceAttached: true,
        assignedTo: 'Sarah Johnson',
        description: 'Monthly inspection of all fire extinguishers. Check pressure gauges, safety pins, and overall condition. Update maintenance tags.',
        priority: 'High',
        notes: 'Extinguisher in kitchen needs pressure check'
      },
      {
        id: '3',
        title: 'Staff Safety Training',
        category: 'WHS',
        dueDate: '2024-01-20',
        status: 'Due',
        evidenceAttached: false,
        assignedTo: 'Mike Wilson',
        description: 'Quarterly workplace health and safety training session for all staff members. Cover emergency procedures and hazard identification.',
        priority: 'Medium',
        notes: ''
      },
      {
        id: '4',
        title: 'Equipment PAT Testing',
        category: 'Test & Tag',
        dueDate: '2024-01-05',
        status: 'Completed',
        evidenceAttached: true,
        assignedTo: 'Lisa Brown',
        description: 'Portable appliance testing for all electrical equipment as per AS/NZS 3760 standards.',
        priority: 'Medium',
        notes: 'All equipment passed testing'
      },
      {
        id: '5',
        title: 'Food Safety Audit',
        category: 'Food Safety',
        dueDate: '2024-01-08',
        status: 'Overdue',
        evidenceAttached: false,
        assignedTo: 'John Smith',
        description: 'Comprehensive food safety audit covering all kitchen areas, storage facilities, and food handling procedures.',
        priority: 'High',
        notes: 'Need to schedule with external auditor'
      }
    ];
    setTasks(sampleTasks);
    setFilteredTasks(sampleTasks);
  }, []);

  useEffect(() => {
    let filtered = tasks;

    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(task => task.category === categoryFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, statusFilter, categoryFilter, searchQuery]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Overdue':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'Due':
        return <Clock className="w-4 h-4 text-accent" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Overdue':
        return 'destructive';
      case 'Due':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Food Safety':
        return 'bg-blue-100 text-blue-800';
      case 'WHS':
        return 'bg-orange-100 text-orange-800';
      case 'Fire Safety':
        return 'bg-red-100 text-red-800';
      case 'Test & Tag':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const markComplete = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: 'Completed' as const } : task
      )
    );
    toast({
      title: "Task completed",
      description: "The task has been marked as complete.",
    });
  };

  const handleUploadEvidence = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, evidenceAttached: true } : task
      )
    );
    toast({
      title: "Evidence uploaded",
      description: "Evidence has been attached to the task.",
    });
  };

  const handleUpdateNotes = (taskId: string, notes: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, notes } : task
      )
    );
    toast({
      title: "Notes updated",
      description: "Task notes have been saved.",
    });
  };

  const handleTaskClick = (task: ComplianceTask) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  const isOverdue = (task: ComplianceTask) => {
    if (task.status === 'Overdue') {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const daysDiff = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 7; // Critical if overdue by more than 7 days
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Tasks</h1>
        <p className="text-muted-foreground">
          Manage and track your compliance tasks
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Due">Due</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
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
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("all");
                  setCategoryFilter("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Compliance Tasks</CardTitle>
              <CardDescription>
                {filteredTasks.length} tasks found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Evidence</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow 
                    key={task.id}
                    className={`cursor-pointer ${
                      task.status === 'Overdue' 
                        ? isOverdue(task)
                          ? 'bg-destructive/20 hover:bg-destructive/30' // Critical overdue
                          : 'bg-accent/20 hover:bg-accent/30' // Regular overdue
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleTaskClick(task)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <span>{task.title}</span>
                        {task.priority === 'High' && (
                          <Badge variant="destructive" className="text-xs">High</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getCategoryColor(task.category)}
                      >
                        {task.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(task.status)}
                        <Badge variant={getStatusBadgeVariant(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.evidenceAttached ? (
                        <Badge variant="default">Attached</Badge>
                      ) : (
                        <Badge variant="outline">None</Badge>
                      )}
                    </TableCell>
                    <TableCell>{task.assignedTo}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskClick(task);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {task.status !== 'Completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              markComplete(task.id);
                            }}
                          >
                            <CheckSquare className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUploadEvidence(task.id);
                          }}
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Evidence
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <TaskDetailModal
        task={selectedTask}
        open={taskDetailOpen}
        onOpenChange={setTaskDetailOpen}
        onMarkComplete={markComplete}
        onUploadEvidence={handleUploadEvidence}
        onUpdateNotes={handleUpdateNotes}
      />
    </div>
  );
};

export default Tasks;