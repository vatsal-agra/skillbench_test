import { motion } from 'framer-motion';
import { FiClock, FiUsers, FiStar, FiImage } from 'react-icons/fi';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { ICourse } from '../types/course';

interface CourseCardProps {
  course: ICourse;
  onClick?: (courseId: string | number) => void;
}

export const CourseCard = ({ course, onClick }: CourseCardProps) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  
  const handleEnrollClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Bypass authentication and directly navigate to the course
    navigate(`/courses/${course.id}`);
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick(course.id as string | number);
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
    >
      <div className="relative">
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          {imageError ? (
            <div className="text-gray-400 flex flex-col items-center">
              <FiImage className="w-12 h-12 mb-2" />
              <span>Image not available</span>
            </div>
          ) : (
            <img 
              src={course.image} 
              alt={course.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>
        <span className="absolute top-3 right-3 bg-primary-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
          {course.category}
        </span>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiUsers className="text-gray-500" />
              <span className="text-sm text-gray-500">{course.students_enrolled} students</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiClock className="text-gray-500" />
              <span className="text-sm text-gray-500">{course.duration} hours</span>
            </div>
          </div>
          <div className="flex items-center text-yellow-400">
            <FiStar className="w-4 h-4 fill-current" />
            <span className="ml-1 text-gray-700">{course.rating}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 h-14">
          <Link to={`/courses/${course.id}`} className="hover:text-blue-600">
            {course.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-12">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <FiClock className="w-4 h-4 mr-1" />
            <span>{course.duration} {course.duration === 1 ? 'hour' : 'hours'}</span>
          </div>
          <div className="flex items-center">
            <FiUsers className="w-4 h-4 mr-1" />
            <span>{course.students_enrolled} students</span>
          </div>
        </div>
        
        <div className="flex justify-center mt-2">
          <button 
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full max-w-xs"
            onClick={handleEnrollClick}
          >
            View Course
          </button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
          <span>Instructor: </span>
          <span className="font-medium text-gray-700">{course.instructor}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
