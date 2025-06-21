
-- Add new columns to the existing tasks table
ALTER TABLE public.tasks 
ADD COLUMN due_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN reminder_enabled BOOLEAN DEFAULT false,
ADD COLUMN category TEXT DEFAULT 'Personal',
ADD COLUMN priority TEXT DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
ADD COLUMN order_index INTEGER DEFAULT 0,
ADD COLUMN parent_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
ADD COLUMN is_subtask BOOLEAN DEFAULT false,
ADD COLUMN recurring_type TEXT CHECK (recurring_type IN ('none', 'daily', 'weekly', 'monthly')) DEFAULT 'none',
ADD COLUMN last_completed_date TIMESTAMP WITH TIME ZONE;

-- Create an index for better performance on parent_task_id
CREATE INDEX idx_tasks_parent_task_id ON public.tasks(parent_task_id);

-- Create an index for better performance on category filtering
CREATE INDEX idx_tasks_category ON public.tasks(category);

-- Create an index for better performance on priority filtering  
CREATE INDEX idx_tasks_priority ON public.tasks(priority);

-- Create an index for order_index for better sorting performance
CREATE INDEX idx_tasks_order_index ON public.tasks(order_index);

-- Create a table for user preferences (theme, etc.)
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user_preferences
CREATE POLICY "Users can view their own preferences" 
  ON public.user_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" 
  ON public.user_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON public.user_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create a function to automatically set order_index for new tasks
CREATE OR REPLACE FUNCTION set_task_order_index()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_index IS NULL OR NEW.order_index = 0 THEN
    SELECT COALESCE(MAX(order_index), 0) + 1
    INTO NEW.order_index
    FROM public.tasks
    WHERE user_id = NEW.user_id AND parent_task_id IS NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set order_index
CREATE TRIGGER trigger_set_task_order_index
  BEFORE INSERT ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION set_task_order_index();
