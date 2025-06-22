
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
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Work': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Personal': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Urgent': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Health': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Finance': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Learning': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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
          "bg-white rounded-lg border border-gray-200 p-4 space-y-3",
          task.completed && "opacity-75",
          isDueSoon && !task.completed && "border-l-4 border-l-red-500"
        )}
      >
        {/* Main Task */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id, !task.completed)}
            className="w-5 h-5 text-primary-accent rounded focus:ring-primary-accent/30 mt-0.5 cursor-pointer"
          />
          
          <div className="flex-1 space-y-3">
            {/* Task Text */}
            <div className="flex items-start justify-between gap-2">
              <span className={cn(
                "text-sm font-medium flex-1 text-primary-accent",
                task.completed && 'line-through opacity-60'
              )}>
                {task.text}
              </span>
            </div>

            {/* Mobile: Badges at bottom + Action buttons on right */}
            <div className="flex items-end justify-between">
              {/* Badges - Mobile: Stack vertically */}
              <div className="flex flex-col gap-1 items-start flex-1 md:flex-row md:flex-wrap md:items-center">
                <Badge variant="outline" className={getCategoryColor(task.category)}>
                  <Tag className="h-3 w-3 mr-1" />
                  {task.category}
                </Badge>
                
                <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                  <Flag className="h-3 w-3 mr-1" />
                  {task.priority}
                </Badge>
                
                {task.due_date && (
                  <Badge variant="outline" className={cn(
                    "text-xs",
                    isDueSoon ? "bg-red-50 text-red-700 border-red-200" : 
                    "bg-blue-50 text-blue-700 border-blue-200"
                  )}>
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(task.due_date), "MMM d")}
                  </Badge>
                )}
                
                {task.reminder_enabled && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <Bell className="h-3 w-3 mr-1" />
                    Reminder
                  </Badge>
                )}
                
                {task.recurring_type !== 'none' && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {task.recurring_type}
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSubtaskForm(!showSubtaskForm)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-primary-accent hover:bg-primary-accent/10"
                  title="Add subtask"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditModal(true)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-primary-accent hover:bg-primary-accent/10"
                  title="Edit task"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                  title="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Subtasks Section */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSubtasks(!showSubtasks)}
                  className="h-6 px-2 text-xs text-primary-accent hover:bg-primary-accent/10"
                >
                  {showSubtasks ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  {task.subtasks.length} subtask{task.subtasks.length !== 1 ? 's' : ''}
                </Button>
                
                {showSubtasks && (
                  <div className="ml-4 space-y-1">
                    {task.subtasks.map(subtask => (
                      <div key={subtask.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => onToggle(subtask.id, !subtask.completed)}
                          className="w-4 h-4 text-primary-accent rounded"
                        />
                        <span className={cn(
                          "text-primary-accent",
                          subtask.completed && 'line-through opacity-60'
                        )}>
                          {subtask.text}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(subtask.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
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
              <div className="ml-4 flex gap-2">
                <Input
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  placeholder="Add a subtask..."
                  className="text-sm h-8 border-gray-300 focus:border-primary-accent focus:ring-primary-accent/30"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                />
                <Button 
                  size="sm" 
                  onClick={handleAddSubtask} 
                  className="h-8 bg-primary-accent hover:bg-primary-accent/90 text-white"
                >
                  Add
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSubtaskForm(false)}
                  className="h-8 text-primary-accent hover:bg-primary-accent/10"
                >
                  Cancel
                </Button>
              </div>
            )}
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
