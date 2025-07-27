{{ ... }}
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

interface AuthContextType {
  user: Session['user'] | null;
  signIn: (email: string, password: string) => Promise<Session | null>;
  signUp: (email: string, password: string) => Promise<Session | null>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { data: session, isLoading } = useQuery<Session>(
    ['auth'],
    async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const signIn = async (email: string, password: string): Promise<Session | null> => {
    try {
      setError(null);
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return session;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
      return null;
    }
  };

  const signUp = async (email: string, password: string): Promise<Session | null> => {
    try {
      setError(null);
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { user, session: null };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
      return null;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign out');
    }
  };

  return {
    user: session?.user || null,
    signIn,
    signUp,
    signOut,
    isLoading,
    error,
  };
};
{{ ... }}
