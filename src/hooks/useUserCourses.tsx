import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export interface UserCourse {
  id: string;
  course_id: string;
  user_id: string;
  progress: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
  course: {
    id: string;
    title: string;
    description: string;
    instructor: string;
    duration: number;
    level: string;
    category: string;
    thumbnail_url: string;
  };
}

export const useUserCourses = () => {
  const { data: session } = useQuery<Session | null>(
    ['auth'],
    async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  return useQuery<UserCourse[]>(
    ['userCourses', session?.user?.id],
    async () => {
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('user_courses')
        .select('*, courses(*)')
        .eq('user_id', session.user.id);

      if (error) throw error;
      return (data as UserCourse[]) || [];
    },
    {
      enabled: !!session?.user?.id,
      retry: false,
    }
  );
};
