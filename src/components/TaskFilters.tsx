
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
    <div className="space-y-6 p-6 glass-card border-0 shadow-lg rounded-2xl hover-lift">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 h-5 w-5" />
        <Input
          placeholder="Search your tasks..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-12 premium-input h-14 text-slate-800 placeholder:text-slate-500 rounded-xl text-lg"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-3">
          <Filter className="h-5 w-5 text-primary-accent" />
          <Label className="text-sm font-semibold text-slate-700">Filters:</Label>
        </div>

        {/* Category Filter */}
        <Select value={filters.category} onValueChange={(value) => onFiltersChange({ ...filters, category: value })}>
          <SelectTrigger className="w-[140px] premium-input h-10 rounded-xl">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="modal-content border-0 rounded-xl shadow-lg">
            <SelectItem value="all" className="hover:bg-slate-100 rounded-lg">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category} className="hover:bg-slate-100 rounded-lg">{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={filters.priority} onValueChange={(value) => onFiltersChange({ ...filters, priority: value })}>
          <SelectTrigger className="w-[130px] premium-input h-10 rounded-xl">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="modal-content border-0 rounded-xl shadow-lg">
            <SelectItem value="all" className="hover:bg-slate-100 rounded-lg">All Priorities</SelectItem>
            {priorities.map(priority => (
              <SelectItem key={priority} value={priority} className="hover:bg-slate-100 rounded-lg">{priority}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Show Completed Toggle */}
        <div className="flex items-center space-x-3 p-3 premium-input rounded-xl">
          <Switch
            id="show-completed"
            checked={filters.showCompleted}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, showCompleted: checked })}
            className="data-[state=checked]:bg-primary-accent"
          />
          <Label htmlFor="show-completed" className="text-sm font-medium text-slate-700">Show completed</Label>
        </div>

        {/* Mark All Completed Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkAllCompleted}
          disabled={taskCounts.remaining === 0}
          className="ml-auto premium-input border-0 font-semibold text-slate-700 hover:bg-slate-50 h-10 rounded-xl"
        >
          <CheckSquare className="h-4 w-4 mr-2" />
          Mark All Done
        </Button>
      </div>

      {/* Active Filters & Stats */}
      <div className="flex flex-wrap items-center gap-3">
        {filters.search && (
          <Badge className="bg-primary-accent/10 text-primary-accent hover:bg-primary-accent/20 font-medium px-3 py-1 rounded-lg">
            Search: "{filters.search}"
          </Badge>
        )}
        {filters.category !== 'all' && (
          <Badge className="bg-slate-50 text-slate-700 border-slate-200 font-medium px-3 py-1 rounded-lg border">
            {filters.category}
          </Badge>
        )}
        {filters.priority !== 'all' && (
          <Badge className="bg-slate-50 text-slate-700 border-slate-200 font-medium px-3 py-1 rounded-lg border">
            {filters.priority} Priority
          </Badge>
        )}
        
        <div className="ml-auto flex gap-4 text-sm text-slate-600 font-medium">
          <span>Total: <span className="font-semibold text-slate-800">{taskCounts.total}</span></span>
          <span>•</span>
          <span>Done: <span className="font-semibold text-green-600">{taskCounts.completed}</span></span>
          <span>•</span>
          <span>Remaining: <span className="font-semibold text-slate-600">{taskCounts.remaining}</span></span>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
