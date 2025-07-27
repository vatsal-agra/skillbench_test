import { useState, useEffect } from 'react';
import { supabase } from '../contexts/AuthContext';
import { useAuth } from './useAuth';

export interface UserCourse {
  id: string;
  course_id: string;
  progress: number;
  completed: boolean;
  last_accessed: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  level?: string;
  duration?: number;
  category?: string;
}

export const useUserCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<UserCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserCourses = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user's courses with course details
      const { data, error: fetchError } = await supabase
        .from('user_courses')
        .select(`
          *,
          courses:course_id (id, title, description, thumbnail, instructor)
        `)
        .eq('user_id', userId);

      if (fetchError) throw fetchError;

      // Transform the data to match our interface
      const formattedCourses = data?.map(uc => ({
        id: uc.id,
        course_id: uc.course_id,
        progress: uc.progress,
        completed: uc.completed,
        last_accessed: uc.last_accessed,
        title: uc.courses?.title || 'Unknown Course',
        description: uc.courses?.description || '',
        thumbnail: uc.courses?.thumbnail || '',
        instructor: uc.courses?.instructor || 'Unknown Instructor',
      })) || [];

      setCourses(formattedCourses);
    } catch (err) {
      console.error('Error fetching user courses:', err);
      setError('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const updateCourseProgress = async (courseId: string, progress: number) => {
    if (!user) return { error: 'Not authenticated' };
    
    try {
      const { data, error } = await supabase
        .from('user_courses')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          progress: Math.min(100, Math.max(0, progress)), // Ensure progress is between 0-100
          completed: progress >= 100,
          last_accessed: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setCourses(prev => 
        prev.map(course => 
          course.course_id === courseId 
            ? { 
                ...course, 
                progress: data.progress, 
                completed: data.completed,
                last_accessed: data.last_accessed 
              } 
            : course
        )
      );
      
      return { data, error: null };
    } catch (err) {
      console.error('Error updating course progress:', err);
      return { data: null, error: err };
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserCourses(user.id);
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  return {
    courses,
    loading,
    error,
    completedCourses: courses.filter(course => course.completed),
    inProgressCourses: courses.filter(course => !course.completed),
    updateCourseProgress,
    refresh: () => user?.id ? fetchUserCourses(user.id) : Promise.resolve(),
  };
};

export default useUserCourses;
