import { useState } from "react";
import { Plus, LogOut, BarChart3 } from "lucide-react";
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
import TaskEditModal from "@/components/TaskEditModal";

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
  const [showMobileForm, setShowMobileForm] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-lavender via-blue-50 to-primary-accent/10 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 gradient-primary rounded-full flex items-center justify-center mb-4 glow-effect">
            <Plus className="h-8 w-8 text-white" />
          </div>
          <p className="text-primary-accent font-medium">Loading your productivity hub...</p>
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-soft-lavender/30 via-blue-50 to-primary-accent/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-accent/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-soft-lavender/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 glass-card border-0 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center glow-effect">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-accent to-blue-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-sm text-gray-600 font-medium">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={signOut}
              variant="outline" 
              size="sm"
              className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 rounded-full font-medium shrink-0"
            >
              <LogOut className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Task Form - Desktop */}
        <div className="hidden md:block">
          <TaskForm 
            onAddTask={addTask}
            editingTask={editingTask}
            onUpdateTask={updateTask}
            onCancelEdit={() => setEditingTask(null)}
          />
        </div>

        {/* Mobile Task Form Modal */}
        {showMobileForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:hidden">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-primary-accent">Add New Task</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMobileForm(false)}
                    className="rounded-full w-8 h-8 p-0 text-primary-accent hover:bg-gray-100"
                  >
                    ×
                  </Button>
                </div>
                <TaskForm 
                  onAddTask={(task) => {
                    addTask(task);
                    setShowMobileForm(false);
                  }}
                  editingTask={null}
                  onUpdateTask={updateTask}
                  onCancelEdit={() => setShowMobileForm(false)}
                />
              </div>
            </div>
          </div>
        )}

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
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary-accent flex items-center justify-between">
                  Your Tasks
                  <span className="text-sm font-normal text-gray-500">
                    {tasks.length} of {allTasks.length} tasks
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-12 h-12 gradient-primary rounded-full flex items-center justify-center mb-4">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-primary-accent font-medium">Loading your tasks...</p>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-soft-lavender to-primary-accent/20 rounded-full flex items-center justify-center mb-6">
                      <Plus className="h-10 w-10 text-primary-accent" />
                    </div>
                    <p className="text-primary-accent text-xl font-semibold mb-2">
                      {allTasks.length === 0 ? "Ready to be productive?" : "No tasks match your filters"}
                    </p>
                    <p className="text-gray-500 font-medium">
                      {allTasks.length === 0 ? "Add your first task to get started!" : "Try adjusting your search or filters"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
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
              <Card className="gradient-primary text-white border-0 shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-1">{taskCounts.total}</div>
                  <div className="text-sm opacity-90 font-medium">Total Tasks</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-1">{taskCounts.completed}</div>
                  <div className="text-sm opacity-90 font-medium">Completed</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white border-0 shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-1">{taskCounts.remaining}</div>
                  <div className="text-sm opacity-90 font-medium">Remaining</div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Progress */}
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-primary-accent flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{completedThisWeek}</div>
                  <div className="text-sm text-gray-600 font-medium">Tasks completed this week</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-primary-accent">Completion Rate</span>
                    <span className="text-primary-accent">
                      {taskCounts.total > 0 ? Math.round((taskCounts.completed / taskCounts.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${taskCounts.total > 0 ? (taskCounts.completed / taskCounts.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2 text-sm text-primary-accent/80 font-medium">
                  <div className="flex justify-between">
                    <span>High Priority:</span>
                    <span className="font-semibold">{allTasks.filter(t => t.priority === 'High' && !t.completed).length} remaining</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Today:</span>
                    <span className="font-semibold">
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

      {/* Floating Action Button - Mobile */}
      <button
        onClick={() => setShowMobileForm(true)}
        className="fab-button flex items-center justify-center md:hidden"
        aria-label="Add new task"
      >
        <Plus className="h-6 w-6 text-white" />
      </button>

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(updates) => {
            updateTask(editingTask.id, updates);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default Index;
