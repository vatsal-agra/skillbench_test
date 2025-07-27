import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAward, FiStar, FiUsers, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface LeaderboardEntry {
  user_id: string;
  name: string;
  email: string;
  points: number;
  rank: number;
  avatar_url?: string;
}

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        
        // Fetch leaderboard data
        const { data: leaderboardData, error: leaderboardError } = await supabase
          .rpc('get_leaderboard', { limit_count: 10 });
        
        if (leaderboardError) throw leaderboardError;
        
        // Get current user's rank and points if not in top 10
        if (user) {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('points')
            .eq('id', user.id)
            .single();
            
          if (!userError && userData) {
            setUserPoints(userData.points || 0);
            
            // Get user's rank
            const { data: rankData, error: rankError } = await supabase
              .rpc('get_user_rank', { user_id_param: user.id });
              
            if (!rankError && rankData !== null) {
              setUserRank(rankData);
            }
          }
        }
        
        // Get total number of users with points > 0
        const { count, error: countError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gt('points', 0);
          
        if (!countError && count !== null) {
          setTotalUsers(count);
        }
        
        setLeaderboard(leaderboardData || []);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user]);

  const getUserRankClass = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-gray-100 text-gray-800';
      case 3: return 'bg-amber-100 text-amber-800';
      default: return 'bg-white';
    }
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1: return <FiAward className="text-yellow-500 text-2xl" />;
      case 2: return <FiAward className="text-gray-400 text-2xl" />;
      case 3: return <FiAward className="text-amber-600 text-2xl" />;
      default: return <span className="text-gray-500 font-medium">{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-lg shadow p-4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
            aria-label="Go back"
          >
            <FiArrowLeft className="text-gray-600 text-xl" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Leaderboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 mr-4">
                <FiUsers className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Learners</p>
                <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50 text-green-600 mr-4">
                <FiAward className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Your Rank</p>
                <p className="text-2xl font-bold">
                  {userRank ? `#${userRank}` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-50 text-amber-600 mr-4">
                <FiStar className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Your Points</p>
                <p className="text-2xl font-bold">
                  {userPoints.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Top Learners</h2>
          </div>
          
          {leaderboard.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {leaderboard.map((entry: LeaderboardEntry) => {
                const isCurrentUser = user?.email === entry.email;
                return (
                  <div 
                    key={entry.user_id}
                    className={`flex items-center p-4 hover:bg-gray-50 ${getUserRankClass(entry.rank)}`}
                  >
                    <div className="w-10 flex-shrink-0 flex items-center justify-center">
                      {getMedalIcon(entry.rank)}
                    </div>
                    
                    <div className="ml-4 flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        {entry.avatar_url ? (
                          <img 
                            src={entry.avatar_url} 
                            alt={entry.name} 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          entry.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {entry.name} {isCurrentUser && <span className="text-xs text-indigo-600 ml-1">(You)</span>}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {entry.points.toLocaleString()} points • {entry.rank === 1 ? '1st' : 
                        entry.rank === 2 ? '2nd' : 
                        entry.rank === 3 ? '3rd' : `${entry.rank}th`} place
                      </p>
                    </div>
                    
                    {entry.rank <= 3 && (
                      <div className="ml-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          entry.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                          entry.rank === 2 ? 'bg-gray-100 text-gray-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {entry.rank === 1 ? 'Gold' : entry.rank === 2 ? 'Silver' : 'Bronze'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No leaderboard data available yet. Be the first to complete a test!
            </div>
          )}
          
          {userRank && userRank > 10 && (
            <div className="p-4 bg-gray-50 text-center">
              <p className="text-sm text-gray-600">
                Your rank: <span className="font-medium">#{userRank}</span> with {userPoints.toLocaleString()} points
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
