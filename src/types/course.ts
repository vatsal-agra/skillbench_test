// Shared course type used throughout the frontend.
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ICourse {
  id: string | number;
  title: string;
  description: string;
  instructor: string;
  duration: number; // duration in hours (or weeks, depending on context)
  level: CourseLevel;
  category: string;
  image: string;
  students_enrolled: number;
  price: number;
  rating: number;
}
