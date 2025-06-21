
import { useState } from "react";
import { Plus, Calendar, Bell, Tag, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Task } from "@/types/task";

interface TaskFormProps {
  onAddTask: (taskData: Partial<Task>) => void;
  editingTask?: Task;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  onCancelEdit?: () => void;
}

const TaskForm = ({ onAddTask, editingTask, onUpdateTask, onCancelEdit }: TaskFormProps) => {
  const [taskText, setTaskText] = useState(editingTask?.text || "");
  const [category, setCategory] = useState(editingTask?.category || "Personal");
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>(editingTask?.priority || "Medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    editingTask?.due_date ? new Date(editingTask.due_date) : undefined
  );
  const [reminderEnabled, setReminderEnabled] = useState(editingTask?.reminder_enabled || false);
  const [recurringType, setRecurringType] = useState<'none' | 'daily' | 'weekly' | 'monthly'>(editingTask?.recurring_type || "none");

  const categories = ['Personal', 'Work', 'Urgent', 'Health', 'Finance', 'Learning'];
  const priorities = ['High', 'Medium', 'Low'] as const;
  const recurringOptions = [
    { value: 'none' as const, label: 'No Repeat' },
    { value: 'daily' as const, label: 'Daily' },
    { value: 'weekly' as const, label: 'Weekly' },
    { value: 'monthly' as const, label: 'Monthly' },
  ];

  const handleSubmit = () => {
    if (!taskText.trim()) return;

    const taskData: Partial<Task> = {
      text: taskText.trim(),
      category,
      priority,
      due_date: dueDate?.toISOString(),
      reminder_enabled: reminderEnabled,
      recurring_type: recurringType,
    };

    if (editingTask && onUpdateTask) {
      onUpdateTask(editingTask.id, taskData);
      onCancelEdit?.();
    } else {
      onAddTask(taskData);
    }

    // Reset form if not editing
    if (!editingTask) {
      setTaskText("");
      setCategory("Personal");
      setPriority("Medium");
      setDueDate(undefined);
      setReminderEnabled(false);
      setRecurringType("none");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          {editingTask ? "Edit Task" : "Add New Task"}
          {editingTask && onCancelEdit && (
            <Button variant="ghost" size="sm" onClick={onCancelEdit} className="ml-auto">
              Cancel
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Task Text Input */}
        <div>
          <Input
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="What needs to be done?"
            className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* First Row: Category and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-white dark:bg-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Flag className="h-3 w-3" />
              Priority
            </Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as 'High' | 'Medium' | 'Low')}>
              <SelectTrigger className="bg-white dark:bg-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map(pri => (
                  <SelectItem key={pri} value={pri}>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        pri === 'High' && "bg-red-500",
                        pri === 'Medium' && "bg-yellow-500",
                        pri === 'Low' && "bg-green-500"
                      )} />
                      {pri}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Second Row: Due Date and Recurring */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white dark:bg-gray-900",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Recurring</Label>
            <Select value={recurringType} onValueChange={(value) => setRecurringType(value as 'none' | 'daily' | 'weekly' | 'monthly')}>
              <SelectTrigger className="bg-white dark:bg-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {recurringOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reminder Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="reminder"
            checked={reminderEnabled}
            onCheckedChange={setReminderEnabled}
          />
          <Label htmlFor="reminder" className="text-sm flex items-center gap-1">
            <Bell className="h-3 w-3" />
            Enable reminder
          </Label>
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          disabled={!taskText.trim()}
        >
          <Plus className="h-4 w-4 mr-1" />
          {editingTask ? "Update Task" : "Add Task"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
