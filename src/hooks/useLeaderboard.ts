import { useState, useEffect } from 'react';
import { supabase } from '../contexts/AuthContext';

export interface LeaderboardUser {
  user_id: string;
  full_name: string;
  avatar_url: string;
  total_points: number;
  courses_completed: number;
  rank: number;
}

export const useLeaderboard = (limit: number = 50) => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, create the function if it doesn't exist
      await supabase.rpc('create_get_leaderboard_function');
      
      // Then fetch the leaderboard
      const { data, error: fetchError } = await supabase
        .rpc('get_leaderboard', { 
          result_limit: limit 
        });

      if (fetchError) throw fetchError;
      
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  // Get current user's rank
  const getUserRank = (userId: string): LeaderboardUser | null => {
    return users.find(user => user.user_id === userId) || null;
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [limit]);

  return {
    users,
    loading,
    error,
    getUserRank,
    refresh: fetchLeaderboard,
  };
};

export default useLeaderboard;
