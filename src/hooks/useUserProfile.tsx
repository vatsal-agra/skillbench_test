import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  points?: number;
  rank?: number;
  created_at?: string;
}

export const useUserProfile = () => {
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

  return useQuery<UserProfile | null>(
    ['userProfile', session?.user?.id],
    async () => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
    {
      enabled: !!session?.user?.id,
      retry: false,
    }
  );
};
