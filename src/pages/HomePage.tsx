import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

import { CourseCard } from '../components/CourseCard';

// Reuse first 3 sample courses from CoursesPage for preview
const previewCourses = [
  {
    id: '1',
    title: 'Web Development Bootcamp',
    description:
      'Master modern web development with React, Node.js, and MongoDB in this comprehensive bootcamp.',
    image:
      'https://picsum.photos/800/600?random=1',
    category: 'Web Development',
    duration: 42,
    price: 1.0,
    level: 'Beginner',
    rating: 4.8,
    students_enrolled: 12500,
    instructor: 'Alex Johnson',
  },
  {
    id: '2',
    title: 'Data Science with Python',
    description:
      'Learn data analysis, visualization, and machine learning using Python libraries like pandas and scikit-learn.',
    image:
      'https://picsum.photos/800/600?random=2',
    category: 'Data Science',
    duration: 38,
    price: 1.0,
    level: 'Intermediate',
    rating: 4.7,
    students_enrolled: 9800,
    instructor: 'Maria Garcia',
  },
  {
    id: '3',
    title: 'UI/UX Design Fundamentals',
    description:
      'Build beautiful and user-friendly interfaces by learning the fundamentals of UI and UX design.',
    image:
      'https://picsum.photos/800/600?random=3',
    category: 'Design',
    duration: 24,
    price: 1.0,
    level: 'Beginner',
    rating: 4.9,
    students_enrolled: 15000,
    instructor: 'Samuel Lee',
  },
] as const;

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Master New Skills with</span>
                <span className="block bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                  Expert-Led Courses
                </span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl lg:mx-0">
                Access high-quality video courses for just $1. Test your knowledge and earn certificates to showcase your skills to the world.
              </p>
              <div className="mt-10">
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Browse Courses
                  <FiArrowRight className="ml-2 -mr-1 h-5 w-5" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  delay: 0.2,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1]
                }
              }}
            >
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <img
                    className="w-full h-auto"
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="Course preview"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="p-3 rounded-full bg-white bg-opacity-90 text-primary-600 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform transition-all hover:scale-110">
                      <FiPlay className="h-8 w-8" aria-hidden="true" />
                      <span className="sr-only">Play video</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Popular Courses Preview */}
      <section className="py-16 bg-gray-50" id="popular-courses">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Popular Courses
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              A taste of what you can learn for just $1
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
            {previewCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/courses"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Browse All Courses
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
