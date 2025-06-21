
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
      <DialogContent className="sm:max-w-md glass-card border-0 shadow-2xl animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary-accent flex items-center justify-between">
            Edit Task
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full w-8 h-8 p-0 hover:bg-primary-accent/10"
            >
              <X className="h-4 w-4 text-primary-accent" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-2">
          {/* Task Text Input */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-primary-accent">Task</Label>
            <Input
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="What needs to be done?"
              className="glass-input border-0 h-12 text-primary-accent placeholder:text-gray-500 focus:ring-2 focus:ring-primary-accent/30 transition-all duration-300"
            />
          </div>

          {/* Category and Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-primary-accent flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="glass-input border-0 h-12 focus:ring-2 focus:ring-primary-accent/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-0">
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="hover:bg-primary-accent/10">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-primary-accent flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Priority
              </Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as 'High' | 'Medium' | 'Low')}>
                <SelectTrigger className="glass-input border-0 h-12 focus:ring-2 focus:ring-primary-accent/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-0">
                  {priorities.map(pri => (
                    <SelectItem key={pri} value={pri} className="hover:bg-primary-accent/10">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-primary-accent flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal glass-input border-0 h-12 hover:bg-primary-accent/5",
                      !dueDate && "text-gray-500"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 glass-card border-0" align="start">
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
              <Label className="text-sm font-semibold text-primary-accent">Recurring</Label>
              <Select value={recurringType} onValueChange={(value) => setRecurringType(value as 'none' | 'daily' | 'weekly' | 'monthly')}>
                <SelectTrigger className="glass-input border-0 h-12 focus:ring-2 focus:ring-primary-accent/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-0">
                  {recurringOptions.map(option => (
                    <SelectItem key={option.value} value={option.value} className="hover:bg-primary-accent/10">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reminder Toggle */}
          <div className="flex items-center space-x-3 p-4 glass-input rounded-lg">
            <Switch
              id="reminder"
              checked={reminderEnabled}
              onCheckedChange={setReminderEnabled}
              className="data-[state=checked]:bg-primary-accent"
            />
            <Label htmlFor="reminder" className="text-sm font-medium text-primary-accent flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Enable reminder notifications
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSave}
              className="flex-1 gradient-primary hover:glow-effect font-semibold text-white h-12 transition-all duration-300 hover:scale-[1.02]"
              disabled={!taskText.trim()}
            >
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1 glass-input border-0 font-semibold text-primary-accent hover:bg-primary-accent/10 h-12 transition-all duration-300"
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
