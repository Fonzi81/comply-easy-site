import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Bell, Clock, Mail, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddReminder: (reminder: any) => void;
}

const ReminderModal = ({ open, onOpenChange, onAddReminder }: ReminderModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    reminderDate: undefined as Date | undefined,
    reminderTime: "09:00",
    frequency: "once",
    methods: {
      email: true,
      sms: false,
      calendar: true,
      dashboard: true
    },
    advanceNotice: "1-day",
    recipient: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.reminderDate) {
      return;
    }

    const newReminder = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      reminderDate: format(formData.reminderDate, 'yyyy-MM-dd'),
      reminderTime: formData.reminderTime,
      frequency: formData.frequency,
      methods: formData.methods,
      advanceNotice: formData.advanceNotice,
      recipient: formData.recipient || "Default User",
      status: 'active',
      createdAt: new Date().toISOString()
    };

    onAddReminder(newReminder);
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "",
      reminderDate: undefined,
      reminderTime: "09:00",
      frequency: "once",
      methods: {
        email: true,
        sms: false,
        calendar: true,
        dashboard: true
      },
      advanceNotice: "1-day",
      recipient: ""
    });
    
    onOpenChange(false);
  };

  const handleMethodChange = (method: string, enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      methods: {
        ...prev.methods,
        [method]: enabled
      }
    }));
  };

  const getSelectedMethodsCount = () => {
    return Object.values(formData.methods).filter(Boolean).length;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-primary" />
            <span>Schedule Reminder</span>
          </DialogTitle>
          <DialogDescription>
            Set up automated reminders for compliance tasks and deadlines.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Reminder Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Fire extinguisher inspection due"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food-safety">Food Safety</SelectItem>
                  <SelectItem value="whs">WHS</SelectItem>
                  <SelectItem value="fire-safety">Fire Safety</SelectItem>
                  <SelectItem value="test-tag">Test & Tag</SelectItem>
                  <SelectItem value="general">General Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional details about this reminder..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Reminder Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.reminderDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.reminderDate ? format(formData.reminderDate, "MMM d") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.reminderDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, reminderDate: date }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminderTime">Time</Label>
              <Input
                id="reminderTime"
                type="time"
                value={formData.reminderTime}
                onChange={(e) => setFormData(prev => ({ ...prev, reminderTime: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select 
                value={formData.frequency} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Once</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Notification Methods</Label>
              <Badge variant="secondary">{getSelectedMethodsCount()} selected</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <Switch
                  checked={formData.methods.email}
                  onCheckedChange={(checked) => handleMethodChange('email', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">SMS</span>
                </div>
                <Switch
                  checked={formData.methods.sms}
                  onCheckedChange={(checked) => handleMethodChange('sms', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Calendar</span>
                </div>
                <Switch
                  checked={formData.methods.calendar}
                  onCheckedChange={(checked) => handleMethodChange('calendar', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Dashboard</span>
                </div>
                <Switch
                  checked={formData.methods.dashboard}
                  onCheckedChange={(checked) => handleMethodChange('dashboard', checked)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="advanceNotice">Advance Notice</Label>
              <Select 
                value={formData.advanceNotice} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, advanceNotice: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">No advance notice</SelectItem>
                  <SelectItem value="1-hour">1 hour before</SelectItem>
                  <SelectItem value="1-day">1 day before</SelectItem>
                  <SelectItem value="3-days">3 days before</SelectItem>
                  <SelectItem value="1-week">1 week before</SelectItem>
                  <SelectItem value="2-weeks">2 weeks before</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">Send To</Label>
              <Input
                id="recipient"
                placeholder="Email or team member"
                value={formData.recipient}
                onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Clock className="w-4 h-4 mr-2" />
              Schedule Reminder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderModal;