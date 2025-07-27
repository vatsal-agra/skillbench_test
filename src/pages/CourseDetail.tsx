import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTestAttempts } from '../hooks/useTestAttempts';

interface Chapter {
  id: string;
  title: string;
  content: string;
  duration: number;
  is_free: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  level: string;
  category: string;
  image: string;
  rating: number;
  students_enrolled: number;
  price: number;
  chapters: Chapter[];
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { attempts, loading: attemptsLoading } = useTestAttempts();
  
  // Mock course data - replace with actual data fetching
  // Note: courseAttempts is available if needed: const courseAttempts = attempts.filter(attempt => attempt.course_id === id);
  const course: Course = {
    id: id || '',
    title: 'Course Title',
    description: 'Course description',
    instructor: 'Instructor Name',
    duration: 8,
    level: 'Beginner',
    category: 'Development',
    image: 'https://via.placeholder.com/300x200',
    rating: 4.5,
    students_enrolled: 100,
    price: 49.99,
    chapters: [
      {
        id: '1',
        title: 'Introduction',
        content: 'Introduction content',
        duration: 30,
        is_free: true
      }
    ]
  };

  if (attemptsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Error handling can be added here if needed
  // For example, if you have an error state from an API call

  const formattedCourse = {
    ...course,
    rating: Number(course.rating) || 0,
    duration: course.duration || 0,
    students_enrolled: course.students_enrolled || 0,
    price: course.price || 0,
  } as Course;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="aspect-w-16 aspect-h-9">
          {formattedCourse.image && (
            <img
              src={formattedCourse.image}
              alt={formattedCourse.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {formattedCourse.title}
          </h1>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {formattedCourse.description}
          </p>
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-sm text-gray-500">
              {formattedCourse.level}
            </span>
            <span className="text-sm text-gray-500">
              {formattedCourse.duration} weeks
            </span>
            <span className="text-sm text-gray-500">
              {formattedCourse.students_enrolled} students
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-gray-900">
              ${formattedCourse.price}
            </span>
            <span className="text-sm text-gray-500">
              {formattedCourse.rating} stars
            </span>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Course Content
          </h2>
          <div className="space-y-4">
            {formattedCourse.chapters.map((chapter) => (
              <div key={chapter.id} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {chapter.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {chapter.duration} mins
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!user) {
                      // Redirect to login if not authenticated
                      window.location.href = '/login';
                      return;
                    }
                    // Handle continue learning logic here
                  }}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                  {user ? 'Continue Learning' : 'Sign in to Enroll'}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Test History
          </h2>
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <div key={attempt.id} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Test {attempt.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(attempt.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    Score: {attempt.score}/{attempt.total_questions}
                  </span>
                  {attempt.passed && (
                    <span className="px-2 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                      Passed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
