
import { useState } from "react";
import { Plus, LogOut, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useEnhancedTasks } from "@/hooks/useEnhancedTasks";
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
  
  const [showMobileForm, setShowMobileForm] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-accent to-accent-purple rounded-full flex items-center justify-center mb-4 shadow-lg floating-animation">
            <Plus className="h-8 w-8 text-white" />
          </div>
          <p className="text-slate-600 font-medium">Loading your productivity hub...</p>
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

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-accent rounded-xl flex items-center justify-center shadow-lg">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-accent">
                TaskFlow
              </h1>
              <p className="text-sm text-slate-600 font-medium">{user.email}</p>
            </div>
          </div>
          
          <Button 
            onClick={handleSignOut}
            variant="outline" 
            size="sm"
            className="premium-button text-white border-0 hover:shadow-lg font-medium rounded-xl px-4 py-2"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Task Form - Desktop */}
        <div className="hidden md:block">
          <TaskForm 
            onAddTask={addTask}
            editingTask={null}
            onUpdateTask={updateTask}
            onCancelEdit={() => {}}
          />
        </div>

        {/* Mobile Task Form Modal */}
        {showMobileForm && (
          <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4 md:hidden">
            <div className="modal-content rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-slate-800">Add New Task</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMobileForm(false)}
                    className="rounded-full w-8 h-8 p-0 hover:bg-slate-100"
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
            <Card className="glass-card border-0 shadow-lg hover-lift rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center justify-between">
                  Your Tasks
                  <span className="text-sm font-normal text-slate-500">
                    {tasks.length} of {allTasks.length} tasks
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {tasksLoading ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-12 h-12 bg-primary-accent rounded-xl flex items-center justify-center mb-4 floating-animation shadow-lg">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-slate-600 font-medium">Loading your tasks...</p>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6">
                      <Plus className="h-10 w-10 text-slate-400" />
                    </div>
                    <p className="text-slate-800 text-xl font-semibold mb-2">
                      {allTasks.length === 0 ? "Ready to be productive?" : "No tasks match your filters"}
                    </p>
                    <p className="text-slate-500 font-medium">
                      {allTasks.length === 0 ? "Add your first task to get started!" : "Try adjusting your search or filters"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.map((task, index) => (
                      <div 
                        key={task.id} 
                        className="fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <TaskItem
                          task={task}
                          onToggle={toggleTask}
                          onDelete={deleteTask}
                          onAddSubtask={handleAddSubtask}
                          onUpdateTask={updateTask}
                        />
                      </div>
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
              <Card className="stat-card rounded-2xl border-0 shadow-lg hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary-accent mb-1">{taskCounts.total}</div>
                  <div className="text-sm text-slate-600 font-medium">Total Tasks</div>
                </CardContent>
              </Card>
              <Card className="stat-card rounded-2xl border-0 shadow-lg hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{taskCounts.completed}</div>
                  <div className="text-sm text-slate-600 font-medium">Completed</div>
                </CardContent>
              </Card>
              <Card className="stat-card rounded-2xl border-0 shadow-lg hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-slate-600 mb-1">{taskCounts.remaining}</div>
                  <div className="text-sm text-slate-600 font-medium">Remaining</div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Progress */}
            <Card className="glass-card border-0 shadow-lg hover-lift rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary-accent" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{completedThisWeek}</div>
                  <div className="text-sm text-slate-600 font-medium">Tasks completed this week</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-700">Completion Rate</span>
                    <span className="text-primary-accent">
                      {taskCounts.total > 0 ? Math.round((taskCounts.completed / taskCounts.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-primary-accent h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${taskCounts.total > 0 ? (taskCounts.completed / taskCounts.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2 text-sm text-slate-600 font-medium">
                  <div className="flex justify-between">
                    <span>High Priority:</span>
                    <span className="font-semibold text-slate-800">{allTasks.filter(t => t.priority === 'High' && !t.completed).length} remaining</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Today:</span>
                    <span className="font-semibold text-slate-800">
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
    </div>
  );
};

export default Index;
