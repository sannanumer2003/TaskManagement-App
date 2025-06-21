
import { useState } from "react";
import { Plus, LogOut, Moon, Sun, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useEnhancedTasks } from "@/hooks/useEnhancedTasks";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Task } from "@/types/task";
import AuthPage from "./Auth";
import TaskForm from "@/components/TaskForm";
import TaskFilters from "@/components/TaskFilters";
import TaskItem from "@/components/TaskItem";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { 
    tasks, 
    allTasks,
    loading: tasksLoading, 
    filters,
    setFilters,
    addTask, 
    updateTask,
    toggleTask, 
    deleteTask,
    markAllCompleted
  } = useEnhancedTasks(user?.id);
  const { preferences, updateTheme } = useUserPreferences(user?.id);
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={() => {}} />;
  }

  const handleAddSubtask = async (parentId: string, text: string) => {
    await addTask({
      text,
      parent_task_id: parentId,
      is_subtask: true,
      category: 'Personal',
      priority: 'Medium',
    });
  };

  const taskCounts = {
    total: allTasks.length,
    completed: allTasks.filter(t => t.completed).length,
    remaining: allTasks.filter(t => !t.completed).length,
  };

  const completedThisWeek = allTasks.filter(task => {
    if (!task.last_completed_date) return false;
    const completedDate = new Date(task.last_completed_date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return completedDate >= weekAgo;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateTheme(preferences?.theme === 'dark' ? 'light' : 'dark')}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {preferences?.theme === 'dark' ? 
                <Sun className="h-4 w-4" /> : 
                <Moon className="h-4 w-4" />
              }
            </Button>
            
            {/* Logout */}
            <Button 
              onClick={signOut}
              variant="outline" 
              size="sm"
              className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Task Form */}
        <TaskForm 
          onAddTask={addTask}
          editingTask={editingTask}
          onUpdateTask={updateTask}
          onCancelEdit={() => setEditingTask(null)}
        />

        {/* Filters */}
        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          taskCounts={taskCounts}
          onMarkAllCompleted={markAllCompleted}
        />

        {/* Tasks Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks List */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center justify-between">
                  Your Tasks
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Showing {tasks.length} of {allTasks.length} tasks
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <div className="text-center py-8">
                    <div className="mx-auto w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-2">
                      <Plus className="h-4 w-4 text-white animate-spin" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">Loading tasks...</p>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                      {allTasks.length === 0 ? "No tasks yet" : "No tasks match your filters"}
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      {allTasks.length === 0 ? "Add your first task above to get started!" : "Try adjusting your search or filters"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                        onAddSubtask={handleAddSubtask}
                        onUpdateTask={updateTask}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Analytics Sidebar */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{taskCounts.total}</div>
                  <div className="text-sm opacity-90">Total Tasks</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{taskCounts.completed}</div>
                  <div className="text-sm opacity-90">Completed</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{taskCounts.remaining}</div>
                  <div className="text-sm opacity-90">Remaining</div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Progress */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedThisWeek}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tasks completed this week</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                    <span className="font-medium">
                      {taskCounts.total > 0 ? Math.round((taskCounts.completed / taskCounts.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${taskCounts.total > 0 ? (taskCounts.completed / taskCounts.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>High Priority:</span>
                    <span>{allTasks.filter(t => t.priority === 'High' && !t.completed).length} remaining</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Today:</span>
                    <span>
                      {allTasks.filter(t => 
                        t.due_date && 
                        new Date(t.due_date).toDateString() === new Date().toDateString() && 
                        !t.completed
                      ).length} tasks
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
