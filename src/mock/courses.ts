import { ICourse } from "../types/course";

// Mock course data used in development mode
export const mockCourses: ICourse[] = [
  {
    id: '1',
    title: 'Web Development Bootcamp',
    description: 'Master modern web development with React, Node.js, and MongoDB.',
    instructor: 'Jane Smith',
    duration: 12,
    level: 'Beginner',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    students_enrolled: 1250,
    price: 0,
    rating: 4.8
  },
  {
    id: '2',
    title: 'Data Science Fundamentals',
    description: 'Learn data analysis and visualization with Python and popular libraries.',
    instructor: 'John Doe',
    duration: 10,
    level: 'Intermediate',
    category: 'Data Science',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    students_enrolled: 890,
    price: 0,
    rating: 4.7
  },
  {
    id: '3',
    title: 'Mobile App Development with Flutter',
    description: 'Build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.',
    instructor: 'Alex Johnson',
    duration: 8,
    level: 'Intermediate',
    category: 'Mobile Development',
    image: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    students_enrolled: 720,
    price: 49.99,
    rating: 4.6
  },
  {
    id: '4',
    title: 'Machine Learning A-Z',
    description: 'Learn to create Machine Learning Algorithms in Python and R from two Data Science experts.',
    instructor: 'Sarah Williams',
    duration: 14,
    level: 'Advanced',
    category: 'Data Science',
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    students_enrolled: 1500,
    price: 79.99,
    rating: 4.8
  },
  {
    id: '5',
    title: 'Complete Python Bootcamp',
    description: 'Go from zero to hero in Python with hands-on projects and real-world applications.',
    instructor: 'Mike Taylor',
    duration: 9,
    level: 'Beginner',
    category: 'Programming',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    students_enrolled: 3200,
    price: 0,
    rating: 4.7
  },
  {
    id: '6',
    title: 'UI/UX Design Masterclass',
    description: 'Learn UI/UX design principles, tools, and techniques to create amazing user experiences.',
    instructor: 'Emily Chen',
    duration: 7,
    level: 'Intermediate',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    students_enrolled: 940,
    price: 59.99,
    rating: 4.9
  },
  {
    id: '7',
    title: 'Cybersecurity Fundamentals',
    description: 'Learn the basics of cybersecurity and how to protect systems from digital attacks.',
    instructor: 'David Kim',
    duration: 11,
    level: 'Intermediate',
    category: 'Security',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    students_enrolled: 680,
    price: 69.99,
    rating: 4.5
  },
  {
    id: '8',
    title: 'Cloud Computing with AWS',
    description: 'Master cloud computing concepts and AWS services to build scalable applications.',
    instructor: 'Robert Wilson',
    duration: 10,
    level: 'Advanced',
    category: 'Cloud Computing',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    students_enrolled: 1120,
    price: 89.99,
    rating: 4.7
  }
];
