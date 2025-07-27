import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export interface TestAttempt {
  id: string;
  user_id: string;
  course_id: string;
  score: number;
  total_questions: number;
  passed: boolean;
  created_at: string;
  completed_at: string;
  course_title: string;
  course?: {
    id: string;
    title: string;
    thumbnail_url: string;
  };
}

export const useTestAttempts = () => {
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

  return useQuery<TestAttempt[]>(
    ['testAttempts', session?.user?.id],
    async () => {
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return (data as TestAttempt[]) || [];
    },
    {
      enabled: !!session?.user?.id,
      retry: false,
    }
  );
};
