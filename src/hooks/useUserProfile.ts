import { useState, useEffect } from 'react';
import { supabase } from '../contexts/AuthContext';
import { useAuth } from './useAuth';

interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  created_at: string;
  stats?: {
    courses_completed: number;
    tests_taken: number;
    total_points: number;
    rank: number;
  };
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch user stats
      const { data: stats } = await supabase
        .rpc('get_user_stats', { user_id: userId })
        .single();

      setProfile({
        ...profileData,
        stats: stats || {
          courses_completed: 0,
          tests_taken: 0,
          total_points: 0,
          rank: 0,
        },
      });
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'Not authenticated' };
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      setProfile(prev => ({
        ...prev,
        ...data,
      }));
      
      return { data, error: null };
    } catch (err) {
      console.error('Error updating profile:', err);
      return { data: null, error: err };
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile(user.id);
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refresh: () => user?.id ? fetchUserProfile(user.id) : Promise.resolve(),
  };
};

export default useUserProfile;
