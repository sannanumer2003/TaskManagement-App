
import { useState } from "react";
import { Plus, Trash2, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

const Index = () => {
  // Mock authentication state - will be replaced with real auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  
  // Task management state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // Mock auth functions - will be replaced with Supabase auth
  const handleLogin = () => {
    setIsAuthenticated(true);
    setUser({ email: "demo@example.com" });
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
    setUser({ email: "demo@example.com" });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setTasks([]);
  };

  // Task management functions
  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTasks([...tasks, task]);
      setNewTask("");
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Simple, beautiful task management
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-500 mb-6">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                Demo Mode - Connect Supabase for real authentication
              </Badge>
            </div>
            <Button 
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
              size="lg"
            >
              <User className="mr-2 h-4 w-4" />
              Demo Login
            </Button>
            <Button 
              onClick={handleSignUp}
              variant="outline" 
              className="w-full border-gray-300 hover:bg-gray-50 transition-all duration-200"
              size="lg"
            >
              Demo Sign Up
            </Button>
            <p className="text-xs text-center text-gray-500 mt-4">
              In demo mode, tasks are only stored temporarily
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            size="sm"
            className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Add Task Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Add New Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <Button 
                onClick={addTask}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Your Tasks
              </CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-2">No tasks yet</p>
                <p className="text-gray-400 text-sm">Add your first task above to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div key={task.id}>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span 
                        className={`flex-1 text-sm ${
                          task.completed 
                            ? 'text-gray-500 line-through' 
                            : 'text-gray-800'
                        }`}
                      >
                        {task.text}
                      </span>
                      <span className="text-xs text-gray-400">
                        {task.createdAt.toLocaleDateString()}
                      </span>
                      <Button
                        onClick={() => deleteTask(task.id)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {index < tasks.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        {tasks.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{tasks.length}</div>
                <div className="text-sm opacity-90">Total Tasks</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {tasks.filter(t => t.completed).length}
                </div>
                <div className="text-sm opacity-90">Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {tasks.filter(t => !t.completed).length}
                </div>
                <div className="text-sm opacity-90">Remaining</div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
