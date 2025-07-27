import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface TestAttempt {
  id: string;
  user_id: string;
  course_id: string;
  score: number;
  total_questions: number;
  passed: boolean;
  created_at: string;
  completed_at: string;
  course: {
    id: string;
    title: string;
    thumbnail_url: string;
  };
}

export const useTestAttempts = () => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchAttempts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('test_attempts')
          .select(`
            *,
            course:course_id(
              title,
              thumbnail_url
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAttempts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch test attempts');
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [user]);

  return {
    attempts,
    loading,
    error,
  };
};

export default useTestAttempts;
