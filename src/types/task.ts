
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  due_date?: string;
  reminder_enabled: boolean;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  order_index: number;
  parent_task_id?: string;
  is_subtask: boolean;
  recurring_type: 'none' | 'daily' | 'weekly' | 'monthly';
  last_completed_date?: string;
  subtasks?: Task[];
}

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}

export interface TaskFilters {
  search: string;
  category: string;
  priority: string;
  showCompleted: boolean;
}
