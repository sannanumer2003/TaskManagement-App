
import { useState, useEffect } from "react";
import { Calendar, Bell, Tag, Flag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Task } from "@/types/task";

interface TaskEditModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Task>) => void;
}

const TaskEditModal = ({ task, isOpen, onClose, onSave }: TaskEditModalProps) => {
  const [taskText, setTaskText] = useState(task.text);
  const [category, setCategory] = useState(task.category);
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>(task.priority);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.due_date ? new Date(task.due_date) : undefined
  );
  const [reminderEnabled, setReminderEnabled] = useState(task.reminder_enabled);
  const [recurringType, setRecurringType] = useState<'none' | 'daily' | 'weekly' | 'monthly'>(task.recurring_type);

  const categories = ['Personal', 'Work', 'Urgent', 'Health', 'Finance', 'Learning'];
  const priorities = ['High', 'Medium', 'Low'] as const;
  const recurringOptions = [
    { value: 'none' as const, label: 'No Repeat' },
    { value: 'daily' as const, label: 'Daily' },
    { value: 'weekly' as const, label: 'Weekly' },
    { value: 'monthly' as const, label: 'Monthly' },
  ];

  // Reset form when task changes
  useEffect(() => {
    setTaskText(task.text);
    setCategory(task.category);
    setPriority(task.priority);
    setDueDate(task.due_date ? new Date(task.due_date) : undefined);
    setReminderEnabled(task.reminder_enabled);
    setRecurringType(task.recurring_type);
  }, [task]);

  const handleSave = () => {
    if (!taskText.trim()) return;

    const updates: Partial<Task> = {
      text: taskText.trim(),
      category,
      priority,
      due_date: dueDate?.toISOString(),
      reminder_enabled: reminderEnabled,
      recurring_type: recurringType,
    };

    onSave(updates);
  };

  const handleCancel = () => {
    // Reset form to original values
    setTaskText(task.text);
    setCategory(task.category);
    setPriority(task.priority);
    setDueDate(task.due_date ? new Date(task.due_date) : undefined);
    setReminderEnabled(task.reminder_enabled);
    setRecurringType(task.recurring_type);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center justify-between">
            Edit Task
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Task Text Input */}
          <div>
            <Label className="text-sm font-medium">Task</Label>
            <Input
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="What needs to be done?"
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 mt-1"
            />
          </div>

          {/* Category and Priority Row */}
          <div className="grid grid-cols-2 gap-3">
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

          {/* Due Date and Recurring Row */}
          <div className="grid grid-cols-2 gap-3">
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
                    {dueDate ? format(dueDate, "MMM d, yyyy") : "Pick a date"}
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

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              disabled={!taskText.trim()}
            >
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditModal;
