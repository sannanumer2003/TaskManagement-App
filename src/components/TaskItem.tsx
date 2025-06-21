
import { useState } from "react";
import { Calendar, Bell, Tag, Flag, Edit, Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format, isToday, isPast } from "date-fns";
import { Task } from "@/types/task";
import TaskEditModal from "./TaskEditModal";

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onAddSubtask: (parentId: string, text: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

const TaskItem = ({ task, onToggle, onDelete, onAddSubtask, onUpdateTask }: TaskItemProps) => {
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [newSubtaskText, setNewSubtaskText] = useState("");
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Work': 'bg-blue-50 text-blue-700 border-blue-200',
      'Personal': 'bg-purple-50 text-purple-700 border-purple-200',
      'Urgent': 'bg-red-50 text-red-700 border-red-200',
      'Health': 'bg-green-50 text-green-700 border-green-200',
      'Finance': 'bg-orange-50 text-orange-700 border-orange-200',
      'Learning': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
    return colors[category as keyof typeof colors] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const handleAddSubtask = () => {
    if (newSubtaskText.trim()) {
      onAddSubtask(task.id, newSubtaskText.trim());
      setNewSubtaskText("");
      setShowSubtaskForm(false);
    }
  };

  const handleEditTask = (updates: Partial<Task>) => {
    onUpdateTask(task.id, updates);
    setShowEditModal(false);
  };

  const isDueSoon = task.due_date && !task.completed && 
    (isToday(new Date(task.due_date)) || isPast(new Date(task.due_date)));

  return (
    <>
      <div
        className={cn(
          "task-card rounded-xl p-4 sm:p-5 space-y-3 transition-all duration-200",
          task.completed && "opacity-60",
          isDueSoon && !task.completed && "border-l-4 border-l-red-400"
        )}
      >
        {/* Main Task */}
        <div className="flex items-start gap-3 sm:gap-4">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id, !task.completed)}
            className="w-5 h-5 text-primary-accent rounded focus:ring-primary-accent/30 mt-0.5 cursor-pointer flex-shrink-0"
          />
          
          <div className="flex-1 space-y-3 min-w-0">
            {/* Task Text and Priority */}
            <div className="flex items-start justify-between gap-3">
              <span className={cn(
                "text-sm sm:text-base font-medium flex-1 break-words",
                task.completed 
                  ? 'text-slate-500 line-through' 
                  : 'text-slate-800'
              )}>
                {task.text}
              </span>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                <Badge variant="secondary" className={cn("text-xs px-2 py-1 rounded-lg border", getPriorityColor(task.priority))}>
                  <Flag className="h-3 w-3 mr-1" />
                  {task.priority}
                </Badge>
              </div>
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="outline" className={cn("text-xs px-2 py-1 rounded-lg border", getCategoryColor(task.category))}>
                <Tag className="h-3 w-3 mr-1" />
                {task.category}
              </Badge>
              
              {task.due_date && (
                <Badge variant="outline" className={cn(
                  "text-xs px-2 py-1 rounded-lg border",
                  isDueSoon ? "bg-red-50 text-red-700 border-red-200" : 
                  "bg-blue-50 text-blue-700 border-blue-200"
                )}>
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(task.due_date), "MMM d")}
                </Badge>
              )}
              
              {task.reminder_enabled && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs px-2 py-1 rounded-lg border">
                  <Bell className="h-3 w-3 mr-1" />
                  Reminder
                </Badge>
              )}
              
              {task.recurring_type !== 'none' && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs px-2 py-1 rounded-lg border">
                  {task.recurring_type}
                </Badge>
              )}
            </div>

            {/* Subtasks Section */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSubtasks(!showSubtasks)}
                  className="h-6 px-2 text-xs rounded-lg hover:bg-slate-100"
                >
                  {showSubtasks ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  {task.subtasks.length} subtask{task.subtasks.length !== 1 ? 's' : ''}
                </Button>
                
                {showSubtasks && (
                  <div className="ml-4 space-y-2">
                    {task.subtasks.map(subtask => (
                      <div key={subtask.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => onToggle(subtask.id, !subtask.completed)}
                          className="w-4 h-4 text-primary-accent rounded flex-shrink-0"
                        />
                        <span className={cn(
                          "flex-1 break-words",
                          subtask.completed 
                            ? 'text-slate-500 line-through' 
                            : 'text-slate-700'
                        )}>
                          {subtask.text}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(subtask.id)}
                          className="h-6 w-6 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Add Subtask Form */}
            {showSubtaskForm && (
              <div className="ml-4 space-y-2">
                <Input
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  placeholder="Add a subtask..."
                  className="premium-input text-sm h-9 rounded-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddSubtask} className="premium-button text-white h-8 rounded-lg text-xs">
                    Add
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowSubtaskForm(false)}
                    className="h-8 rounded-lg text-xs hover:bg-slate-100"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSubtaskForm(!showSubtaskForm)}
              className="h-8 w-8 p-0 text-slate-400 hover:text-primary-accent hover:bg-slate-100 rounded-lg"
              title="Add subtask"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditModal(true)}
              className="h-8 w-8 p-0 text-slate-400 hover:text-primary-accent hover:bg-slate-100 rounded-lg"
              title="Edit task"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
              title="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <TaskEditModal
        task={task}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditTask}
      />
    </>
  );
};

export default TaskItem;
