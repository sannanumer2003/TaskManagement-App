import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Task, TaskFilters } from "@/types/task";

export const useEnhancedTasks = (userId: string | undefined) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    category: 'all',
    priority: 'all',
    showCompleted: true,
  });
  const { toast } = useToast();

  const fetchTasks = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      
      // Organize tasks with subtasks and ensure proper typing
      const mainTasks = data?.filter(task => !task.is_subtask) || [];
      const subtasks = data?.filter(task => task.is_subtask) || [];
      
      const tasksWithSubtasks = mainTasks.map(task => ({
        ...task,
        // Type cast database values to match our interfaces
        priority: (task.priority || 'Medium') as 'High' | 'Medium' | 'Low',
        recurring_type: (task.recurring_type || 'none') as 'none' | 'daily' | 'weekly' | 'monthly',
        category: task.category || 'Personal',
        reminder_enabled: task.reminder_enabled || false,
        is_subtask: task.is_subtask || false,
        order_index: task.order_index || 0,
        subtasks: subtasks
          .filter(subtask => subtask.parent_task_id === task.id)
          .map(subtask => ({
            ...subtask,
            priority: (subtask.priority || 'Medium') as 'High' | 'Medium' | 'Low',
            recurring_type: (subtask.recurring_type || 'none') as 'none' | 'daily' | 'weekly' | 'monthly',
            category: subtask.category || 'Personal',
            reminder_enabled: subtask.reminder_enabled || false,
            is_subtask: subtask.is_subtask || false,
            order_index: subtask.order_index || 0,
          }))
      }));
      
      setTasks(tasksWithSubtasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: Partial<Task>) => {
    if (!userId || !taskData.text?.trim()) return;

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ 
          ...taskData,
          text: taskData.text.trim(), 
          user_id: userId,
          category: taskData.category || 'Personal',
          priority: taskData.priority || 'Medium',
          recurring_type: taskData.recurring_type || 'none',
          reminder_enabled: taskData.reminder_enabled || false,
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchTasks();
      toast({
        title: "Task Added",
        description: "Your task has been added successfully!",
      });
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", taskId);

      if (error) throw error;
      await fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    const updates: Partial<Task> = { 
      completed,
      last_completed_date: completed ? new Date().toISOString() : null 
    };
    await updateTask(taskId, updates);
  };

  const deleteTask = async (taskId: string) => {
    try {
      // Delete subtasks first
      const { error: subtaskError } = await supabase
        .from("tasks")
        .delete()
        .eq("parent_task_id", taskId);

      if (subtaskError) throw subtaskError;

      // Delete main task
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;

      await fetchTasks();
      toast({
        title: "Task Deleted",
        description: "Task and its subtasks have been deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",  
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const reorderTasks = async (reorderedTasks: Task[]) => {
    try {
      const updates = reorderedTasks.map((task, index) => ({
        id: task.id,
        order_index: index + 1,
      }));

      for (const update of updates) {
        await supabase
          .from("tasks")
          .update({ order_index: update.order_index })
          .eq("id", update.id);
      }

      await fetchTasks();
    } catch (error) {
      console.error("Error reordering tasks:", error);
      toast({
        title: "Error",
        description: "Failed to reorder tasks",
        variant: "destructive",
      });
    }
  };

  const markAllCompleted = async () => {
    try {
      const incompleteTasks = tasks.filter(task => !task.completed);
      
      for (const task of incompleteTasks) {
        await supabase
          .from("tasks")
          .update({ 
            completed: true,
            last_completed_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq("id", task.id);
      }

      await fetchTasks();
      toast({
        title: "All Tasks Completed",
        description: `Marked ${incompleteTasks.length} tasks as completed!`,
      });
    } catch (error) {
      console.error("Error marking all tasks completed:", error);
      toast({
        title: "Error",
        description: "Failed to mark all tasks as completed",
        variant: "destructive",
      });
    }
  };

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === 'all' || task.category === filters.category;
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    const matchesCompleted = filters.showCompleted || !task.completed;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesCompleted;
  });

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    loading,
    filters,
    setFilters,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    reorderTasks,
    markAllCompleted,
    refetch: fetchTasks,
  };
};
