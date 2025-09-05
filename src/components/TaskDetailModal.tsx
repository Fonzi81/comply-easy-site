import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  CheckSquare, 
  Upload, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  User,
  FileText,
  MessageSquare
} from "lucide-react";

interface ComplianceTask {
  id: string;
  title: string;
  description: string | null;
  category: 'food_safety' | 'whs' | 'fire_safety' | 'test_tag';
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: number;
  assigned_to: string | null;
  evidence_required: boolean;
}

interface TaskDetailModalProps {
  task: ComplianceTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkComplete: (taskId: string) => void;
  onUploadEvidence: (taskId: string) => void;
  onEdit: (task: ComplianceTask) => void;
  onDelete: (taskId: string) => void;
}

const TaskDetailModal = ({ 
  task, 
  open, 
  onOpenChange, 
  onMarkComplete, 
  onUploadEvidence,
  onEdit,
  onDelete
}: TaskDetailModalProps) => {
  const [notes, setNotes] = useState("");

  if (!task) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'pending':
      case 'in_progress':
        return <Clock className="w-5 h-5 text-accent" />;
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
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'whs':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'fire_safety':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'test_tag':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 3:
        return 'destructive';
      case 2:
        return 'secondary';
      case 1:
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 3: return 'High';
      case 2: return 'Medium';
      case 1: return 'Low';
      default: return 'Medium';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {getStatusIcon(task.status)}
                <span className="text-xl">{task.title}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={getCategoryColor(task.category)}
                >
                  {getCategoryDisplayText(task.category)}
                </Badge>
                <Badge variant={getStatusBadgeVariant(task.status)}>
                  {getStatusDisplayText(task.status)}
                </Badge>
                <Badge variant={getPriorityColor(task.priority)}>
                  {getPriorityText(task.priority)} Priority
                </Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Task details and management options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Due Date:</span>
                <span>{new Date(task.due_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Assigned To:</span>
                <span>{task.assigned_to || 'Unassigned'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Evidence:</span>
                <Badge variant={task.evidence_required ? "secondary" : "outline"}>
                  {task.evidence_required ? "Required" : "Optional"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <Label className="text-base font-medium">Description</Label>
              <p className="mt-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                {task.description}
              </p>
            </div>
          )}

          {/* Notes Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <Label htmlFor="notes" className="text-base font-medium">Notes</Label>
            </div>
            <Textarea
              id="notes"
              placeholder="Add notes about this task..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex space-x-2">
              <Button onClick={() => onEdit(task)} variant="outline" size="sm">
                Edit Task
              </Button>
              <Button onClick={() => onDelete(task.id)} variant="destructive" size="sm">
                Delete Task
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            {task.status !== 'completed' && (
              <Button
                onClick={() => onMarkComplete(task.id)}
                className="flex-1"
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>
            )}
            <Button
              onClick={() => onUploadEvidence(task.id)}
              variant="outline"
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Evidence
            </Button>
          </div>

          {/* Completion Status */}
          {task.status === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Task Completed</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                This task has been marked as complete. Great job!
              </p>
            </div>
          )}

          {/* Overdue Warning */}
          {task.status === 'overdue' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">Task Overdue</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                This task is past its due date. Please complete it as soon as possible.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;