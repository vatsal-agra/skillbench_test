import { useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FiCheckCircle } from 'react-icons/fi';
import { useUserProfile } from '../hooks/useUserProfile';
import { useUserCourses, type UserCourse } from '../hooks/useUserCourses';
import { useTestAttempts } from '../hooks/useTestAttempts';

const ProfilePage = () => {
  const { user: authUser } = useAuth();
  
  // Fetch user data
  const { profile, loading: profileLoading } = useUserProfile();
  const { courses: enrolledCourses = [], loading: coursesLoading } = useUserCourses();
  const { attempts: testHistory = [], loading: testsLoading } = useTestAttempts();
  
  // Calculate completed courses
  const completedCourses = enrolledCourses.filter((course) => course.completed);

  // Calculate stats
  const stats = {
    enrolled: enrolledCourses.length,
    completed: completedCourses.length,
    points: profile?.stats?.total_points || 0,
    rank: profile?.stats?.rank || 0,
    tests: testHistory.length
  };

  // Get user display name
  const getUserName = useCallback(() => {
    return profile?.full_name || authUser?.email || 'User';
  }, [profile, authUser]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format course for display
  const formatCourse = (course: UserCourse) => ({
    id: course.course_id,
    title: course.title || 'Untitled Course',
    instructor: course.instructor || 'Unknown Instructor',
    progress: course.progress || 0,
    completed: course.completed,
    thumbnail: course.thumbnail || '',
  });

  // Loading state
  if (profileLoading || coursesLoading || testsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="bg-blue-600 p-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-20 w-20 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
                  alt="Profile"
                />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">{getUserName()}</h1>
                <p className="text-sm text-blue-100">
                  {authUser?.email}
                </p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Statistics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm text-blue-700">Courses Enrolled</h3>
                    <p className="text-2xl font-bold text-blue-600">{stats.enrolled}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm text-green-700">Courses Completed</h3>
                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-sm text-yellow-700">Points Earned</h3>
                    <p className="text-2xl font-bold text-yellow-600">{stats.points}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm text-purple-700">Rank</h3>
                    <p className="text-2xl font-bold text-purple-600">{stats.rank}</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {testHistory.map((test) => (
                    <div key={test.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{test.course.title}</h3>
                        <span className="text-sm text-gray-500">
                          {formatDate(test.created_at)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="text-sm text-gray-600">
                          Score: {test.score}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Questions: {test.total_questions}/{test.total_questions}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {formatCourse(course).thumbnail && (
                    <img
                      src={formatCourse(course).thumbnail}
                      alt={formatCourse(course).title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 h-12">
                    {formatCourse(course).title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2 h-10">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {course.level || 'All Levels'}
                    </span>
                    {course.duration && (
                      <span className="text-xs text-gray-500">
                        {course.duration} weeks
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FiCheckCircle className="text-green-500" />
                      <span className="text-sm text-gray-600">
                        {formatCourse(course).progress}% Complete
                      </span>
                    </div>
                    {formatCourse(course).completed && (
                      <span className="px-2.5 py-0.5 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
