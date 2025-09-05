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
  Eye,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import TaskDetailModal from "@/components/TaskDetailModal";
import AddTaskModal from "@/components/AddTaskModal";
import EditTaskModal from "@/components/EditTaskModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface ComplianceTask {
  id: string;
  title: string;
  description: string | null;
  category: 'food_safety' | 'whs' | 'fire_safety' | 'test_tag';
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: number;
  assigned_to: string | null;
  created_by: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  evidence_required: boolean;
}

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<ComplianceTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<ComplianceTask[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<ComplianceTask | null>(null);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ComplianceTask | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('compliance_tasks')
        .select(`
          *,
          organizations!inner(id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTasks(data || []);
      setFilteredTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
        task.assigned_to?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, statusFilter, categoryFilter, searchQuery]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'pending':
      case 'in_progress':
        return <Clock className="w-4 h-4 text-accent" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'overdue':
        return 'destructive';
      case 'pending':
      case 'in_progress':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Due';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'overdue':
        return 'Overdue';
      default:
        return status;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food_safety':
        return 'bg-blue-100 text-blue-800';
      case 'whs':
        return 'bg-orange-100 text-orange-800';
      case 'fire_safety':
        return 'bg-red-100 text-red-800';
      case 'test_tag':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryDisplayText = (category: string) => {
    switch (category) {
      case 'food_safety':
        return 'Food Safety';
      case 'whs':
        return 'WHS';
      case 'fire_safety':
        return 'Fire Safety';
      case 'test_tag':
        return 'Test & Tag';
      default:
        return category;
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 3:
        return 'High';
      case 2:
        return 'Medium';
      case 1:
        return 'Low';
      default:
        return 'Medium';
    }
  };

  const markComplete = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('compliance_tasks')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      await loadTasks();
      toast({
        title: "Task completed",
        description: "The task has been marked as complete.",
      });
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "Failed to complete task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('compliance_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      await loadTasks();
      toast({
        title: "Task deleted",
        description: "The task has been permanently deleted.",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (task: ComplianceTask) => {
    setEditingTask(task);
    setEditTaskOpen(true);
  };

  const handleUploadEvidence = (taskId: string) => {
    // This would integrate with actual evidence upload functionality
    toast({
      title: "Evidence upload",
      description: "Evidence upload functionality coming soon.",
    });
  };

  const handleTaskClick = (task: ComplianceTask) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  const isOverdue = (task: ComplianceTask) => {
    if (task.status === 'overdue') {
      const dueDate = new Date(task.due_date);
      const today = new Date();
      const daysDiff = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 7; // Critical if overdue by more than 7 days
    }
    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                  <SelectItem value="pending">Due</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
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
                  <SelectItem value="food_safety">Food Safety</SelectItem>
                  <SelectItem value="whs">WHS</SelectItem>
                  <SelectItem value="fire_safety">Fire Safety</SelectItem>
                  <SelectItem value="test_tag">Test & Tag</SelectItem>
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
            <Button onClick={() => setAddTaskOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
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
                      task.status === 'overdue' 
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
                        {task.priority === 3 && (
                          <Badge variant="destructive" className="text-xs">High</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getCategoryColor(task.category)}
                      >
                        {getCategoryDisplayText(task.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(task.due_date), 'yyyy-MM-dd')}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(task.status)}
                        <Badge variant={getStatusBadgeVariant(task.status)}>
                          {getStatusDisplayText(task.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.evidence_required ? (
                        <Badge variant="outline">Required</Badge>
                      ) : (
                        <Badge variant="outline">Optional</Badge>
                      )}
                    </TableCell>
                    <TableCell>{task.assigned_to || 'Unassigned'}</TableCell>
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTask(task);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        {task.status !== 'completed' && (
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
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this task?')) {
                              handleDeleteTask(task.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
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
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      <AddTaskModal
        open={addTaskOpen}
        onOpenChange={setAddTaskOpen}
        onSuccess={loadTasks}
      />

      <EditTaskModal
        task={editingTask}
        open={editTaskOpen}
        onOpenChange={setEditTaskOpen}
        onSuccess={loadTasks}
      />
    </div>
  );
};

export default Tasks;