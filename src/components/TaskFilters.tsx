
import { Search, Filter, CheckSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TaskFilters as TaskFiltersType } from "@/types/task";

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  taskCounts: {
    total: number;
    completed: number;
    remaining: number;
  };
  onMarkAllCompleted: () => void;
}

const TaskFilters = ({ filters, onFiltersChange, taskCounts, onMarkAllCompleted }: TaskFiltersProps) => {
  const categories = ['Personal', 'Work', 'Urgent', 'Health', 'Finance', 'Learning'];
  const priorities = ['High', 'Medium', 'Low'];

  return (
    <div className="space-y-4 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-10 bg-white dark:bg-gray-900"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Label className="text-sm font-medium">Filters:</Label>
        </div>

        {/* Category Filter */}
        <Select value={filters.category} onValueChange={(value) => onFiltersChange({ ...filters, category: value })}>
          <SelectTrigger className="w-[120px] bg-white dark:bg-gray-900">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={filters.priority} onValueChange={(value) => onFiltersChange({ ...filters, priority: value })}>
          <SelectTrigger className="w-[110px] bg-white dark:bg-gray-900">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {priorities.map(priority => (
              <SelectItem key={priority} value={priority}>{priority}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Show Completed Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="show-completed"
            checked={filters.showCompleted}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, showCompleted: checked })}
          />
          <Label htmlFor="show-completed" className="text-sm">Show completed</Label>
        </div>

        {/* Mark All Completed Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkAllCompleted}
          disabled={taskCounts.remaining === 0}
          className="ml-auto"
        >
          <CheckSquare className="h-4 w-4 mr-1" />
          Mark All Done
        </Button>
      </div>

      {/* Active Filters & Stats */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.search && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Search: "{filters.search}"
          </Badge>
        )}
        {filters.category !== 'all' && (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            {filters.category}
          </Badge>
        )}
        {filters.priority !== 'all' && (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            {filters.priority} Priority
          </Badge>
        )}
        
        <div className="ml-auto flex gap-2 text-xs text-gray-600 dark:text-gray-400">
          <span>Total: {taskCounts.total}</span>
          <span>•</span>
          <span>Done: {taskCounts.completed}</span>
          <span>•</span>
          <span>Remaining: {taskCounts.remaining}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
