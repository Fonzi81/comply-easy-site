import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from "lucide-react";
import { format, isToday, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from "date-fns";

interface ComplianceItem {
  id: string;
  title: string;
  category: 'food-safety' | 'whs' | 'fire-safety' | 'test-tag';
  dueDate: string;
  status: 'completed' | 'overdue' | 'upcoming';
  priority: 'high' | 'medium' | 'low';
}

interface ComplianceCalendarProps {
  complianceItems: ComplianceItem[];
}

const ComplianceCalendar = ({ complianceItems }: ComplianceCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food-safety': return 'bg-blue-500';
      case 'whs': return 'bg-yellow-500';
      case 'fire-safety': return 'bg-red-500';
      case 'test-tag': return 'bg-purple-500';
      default: return 'bg-gray-500';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      case 'upcoming': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredItems = useMemo(() => {
    return complianceItems.filter(item => 
      filterCategory === 'all' || item.category === filterCategory
    );
  }, [complianceItems, filterCategory]);

  const getItemsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredItems.filter(item => item.dueDate === dateStr);
  };

  const upcomingItems = useMemo(() => {
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);
    
    return filteredItems
      .filter(item => {
        const itemDate = new Date(item.dueDate);
        return itemDate >= today && itemDate <= next30Days;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 10);
  }, [filteredItems]);

  const selectedDateItems = selectedDate ? getItemsForDate(selectedDate) : [];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-heading font-bold">Compliance Calendar</h3>
        <div className="flex items-center space-x-4">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="food-safety">Food Safety</SelectItem>
              <SelectItem value="whs">WHS</SelectItem>
              <SelectItem value="fire-safety">Fire Safety</SelectItem>
              <SelectItem value="test-tag">Test & Tag</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant={viewMode === 'month' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
            <Button 
              variant={viewMode === 'agenda' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('agenda')}
            >
              Agenda
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'month' ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h4 className="text-lg font-semibold">
                    {format(currentDate, 'MMMM yyyy')}
                  </h4>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentDate}
                  onMonthChange={setCurrentDate}
                  className="pointer-events-auto"
                  modifiers={{
                    hasItems: (date) => getItemsForDate(date).length > 0,
                    hasOverdue: (date) => getItemsForDate(date).some(item => item.status === 'overdue'),
                  }}
                  modifiersStyles={{
                    hasItems: { 
                      backgroundColor: 'hsl(var(--primary) / 0.1)',
                      border: '2px solid hsl(var(--primary) / 0.3)'
                    },
                    hasOverdue: { 
                      backgroundColor: 'hsl(var(--destructive) / 0.1)',
                      border: '2px solid hsl(var(--destructive) / 0.5)'
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Selected Date Details */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span>
                    {selectedDate 
                      ? format(selectedDate, 'MMM d, yyyy')
                      : 'Select a date'
                    }
                  </span>
                </CardTitle>
                <CardDescription>
                  {selectedDate && isToday(selectedDate) && "Today's tasks"}
                  {selectedDateItems.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedDateItems.length} {selectedDateItems.length === 1 ? 'task' : 'tasks'}
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDateItems.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateItems.map((item) => (
                      <div key={item.id} className={`p-3 border rounded-lg ${getStatusColor(item.status)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-2">
                            <span className="text-lg">{getCategoryIcon(item.category)}</span>
                            <div>
                              <p className="font-medium text-sm">{item.title}</p>
                              <p className="text-xs opacity-75 capitalize">{item.category.replace('-', ' ')}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={item.priority === 'high' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {item.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    {selectedDate ? 'No tasks scheduled for this date' : 'Select a date to view tasks'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Agenda View */
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Compliance Tasks</CardTitle>
            <CardDescription>Next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingItems.length > 0 ? (
              <div className="space-y-4">
                {upcomingItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${getCategoryColor(item.category)}`} />
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(item.dueDate), 'MMM d, yyyy')} • {item.category.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'}>
                        {item.priority}
                      </Badge>
                      <Badge variant={
                        item.status === 'completed' ? 'default' : 
                        item.status === 'overdue' ? 'destructive' : 'secondary'
                      }>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No upcoming compliance tasks</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComplianceCalendar;