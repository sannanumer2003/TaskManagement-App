
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
    <div className="space-y-6 p-6 glass-card border-0 shadow-xl rounded-2xl">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-accent/60 h-5 w-5" />
        <Input
          placeholder="Search your tasks..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-12 border-gray-300 h-14 text-primary-accent placeholder:text-gray-500 focus:border-primary-accent focus:ring-primary-accent/30 text-lg"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 items-start">
        <div className="flex items-center space-x-3">
          <Filter className="h-5 w-5 text-primary-accent" />
          <Label className="text-sm font-semibold text-primary-accent">Filters:</Label>
        </div>

        {/* Category Filter */}
        <Select value={filters.category} onValueChange={(value) => onFiltersChange({ ...filters, category: value })}>
          <SelectTrigger className="w-[140px] glass-input border-0 h-10 focus:ring-2 focus:ring-primary-accent/30 text-primary-accent">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200">
            <SelectItem value="all" className="hover:bg-primary-accent/10">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category} className="hover:bg-primary-accent/10">{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={filters.priority} onValueChange={(value) => onFiltersChange({ ...filters, priority: value })}>
          <SelectTrigger className="w-[130px] glass-input border-0 h-10 focus:ring-2 focus:ring-primary-accent/30 text-primary-accent">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200">
            <SelectItem value="all" className="hover:bg-primary-accent/10">All Priorities</SelectItem>
            {priorities.map(priority => (
              <SelectItem key={priority} value={priority} className="hover:bg-primary-accent/10">{priority}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Show Completed Toggle */}
        <div className="flex items-center space-x-3 p-3 glass-input border-0 rounded-lg">
          <Switch
            id="show-completed"
            checked={filters.showCompleted}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, showCompleted: checked })}
            className="data-[state=checked]:bg-primary-accent"
          />
          <Label htmlFor="show-completed" className="text-sm font-medium text-primary-accent">Show completed</Label>
        </div>

        {/* Mark All Completed Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkAllCompleted}
          disabled={taskCounts.remaining === 0}
          className="glass-input border-0 font-semibold text-primary-accent hover:bg-primary-accent/10 h-10"
        >
          <CheckSquare className="h-4 w-4 mr-2" />
          Mark All Done
        </Button>
      </div>

      {/* Active Filters & Stats */}
      <div className="flex flex-wrap items-center gap-3">
        {filters.search && (
          <Badge className="bg-primary-accent/10 text-primary-accent hover:bg-primary-accent/20 font-medium px-3 py-1">
            Search: "{filters.search}"
          </Badge>
        )}
        {filters.category !== 'all' && (
          <Badge className="bg-green-100 text-green-800 font-medium px-3 py-1">
            {filters.category}
          </Badge>
        )}
        {filters.priority !== 'all' && (
          <Badge className="bg-orange-100 text-orange-800 font-medium px-3 py-1">
            {filters.priority} Priority
          </Badge>
        )}
        
        <div className="ml-auto flex gap-4 text-sm text-primary-accent/80 font-medium">
          <span>Total: <span className="font-semibold text-primary-accent">{taskCounts.total}</span></span>
          <span>•</span>
          <span>Done: <span className="font-semibold text-green-600">{taskCounts.completed}</span></span>
          <span>•</span>
          <span>Remaining: <span className="font-semibold text-orange-600">{taskCounts.remaining}</span></span>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
