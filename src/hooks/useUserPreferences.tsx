
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserPreferences } from "@/types/task";

export const useUserPreferences = (userId: string | undefined) => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPreferences = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        // Create default preferences
        const { data: newPrefs, error: createError } = await supabase
          .from("user_preferences")
          .insert([{ user_id: userId, theme: 'light' }])
          .select()
          .single();

        if (createError) throw createError;
        setPreferences({
          ...newPrefs,
          theme: (newPrefs.theme || 'light') as 'light' | 'dark'
        });
      } else {
        setPreferences({
          ...data,
          theme: (data.theme || 'light') as 'light' | 'dark'
        });
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = async (theme: 'light' | 'dark') => {
    if (!userId || !preferences) return;

    try {
      const { error } = await supabase
        .from("user_preferences")
        .update({ theme, updated_at: new Date().toISOString() })
        .eq("user_id", userId);

      if (error) throw error;
      
      setPreferences({ ...preferences, theme });
      
      // Apply theme to document
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch (error) {
      console.error("Error updating theme:", error);
      toast({
        title: "Error",
        description: "Failed to update theme",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [userId]);

  useEffect(() => {
    if (preferences?.theme) {
      document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
    }
  }, [preferences?.theme]);

  return {
    preferences,
    loading,
    updateTheme,
  };
};
