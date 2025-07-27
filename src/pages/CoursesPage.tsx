import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ICourse } from '../types/course';
import { CourseCard } from '../components/CourseCard';
import { FiFilter } from 'react-icons/fi';

type FilterOptions = {
  level: string[];
  category: string[];
  duration: string;
};

export const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    level: searchParams.get('level')?.split(',') || [],
    category: searchParams.get('category')?.split(',') || [],
    duration: searchParams.get('duration') || 'all',
  });

  // Fetch courses with filters
  const {
    data: courses = [],
    isLoading,
    error,
  } = useQuery<ICourse[]>({
    queryKey: ['courses', searchQuery, filters],
    queryFn: async () => {
      let query = supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply search filter
      if (searchQuery) {
        query = query.or(`
          title.ilike.%${searchQuery}%,
          description.ilike.%${searchQuery}%
        `);
      }

      // Apply level filter
      if (filters.level.length > 0) {
        query = query.in('level', filters.level);
      }

      // Apply category filter
      if (filters.category.length > 0) {
        query = query.in('category', filters.category);
      }

      // Apply duration filter
      if (filters.duration !== 'all') {
        switch (filters.duration) {
          case 'beginner':
            query = query.eq('level', 'beginner');
            break;
          case 'intermediate':
            query = query.eq('level', 'intermediate');
            break;
          case 'advanced':
            query = query.eq('level', 'advanced');
            break;
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (filters.level.length > 0) params.set('level', filters.level.join(','));
    if (filters.category.length > 0) params.set('category', filters.category.join(','));
    if (filters.duration !== 'all') params.set('duration', filters.duration);
    
    setSearchParams(params, { replace: true });
  }, [searchQuery, filters, setSearchParams]);

  // Filter options (kept for future use in the UI)
  const levelOptions = ['beginner', 'intermediate', 'advanced'] as const;
  const categoryOptions = [
    'web development',
    'mobile development',
    'data science',
    'design',
    'business',
  ] as const;
  const durationOptions = [
    { value: 'all', label: 'All Durations' },
    { value: 'short', label: 'Short (< 2h)' },
    { value: 'medium', label: 'Medium (2-10h)' },
    { value: 'long', label: 'Long (> 10h)' },
  ] as const;

  // Check if any filters are active (for future UI indicators)
  const hasActiveFilters =
    filters.level.length > 0 ||
    filters.category.length > 0 ||
    filters.duration !== 'all' ||
    searchQuery !== '';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:truncate">
                Courses
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200" />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">Loading...</h3>
                  <p className="mt-1 text-sm text-gray-500">Loading...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:truncate">
                Courses
              </h2>
            </div>
          </div>
          <div className="text-center">
            <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading courses</h3>
            <p className="mt-1 text-sm text-gray-500">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:truncate">
              Courses
            </h2>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FiFilter className="-ml-1 mr-2 h-5 w-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-8">
            <div className="bg-white shadow-sm rounded-lg p-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                    Search
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSearchParams({ q: e.target.value });
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Search courses..."
                    />
                  </div>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {levelOptions.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => {
                          const newLevels = filters.level.includes(level)
                            ? filters.level.filter(l => l !== level)
                            : [...filters.level, level];
                          setFilters(prev => ({
                            ...prev,
                            level: newLevels
                          }));
                        }}
                        className={`px-3 py-1 text-sm rounded-full ${
                          filters.level.includes(level)
                            ? 'bg-primary-100 text-primary-800 border border-primary-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          const newCategories = filters.category.includes(category)
                            ? filters.category.filter(c => c !== category)
                            : [...filters.category, category];
                          setFilters(prev => ({
                            ...prev,
                            category: newCategories
                          }));
                        }}
                        className={`px-3 py-1 text-sm rounded-full ${
                          filters.category.includes(category)
                            ? 'bg-primary-100 text-primary-800 border border-primary-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <select
                    value={filters.duration}
                    onChange={(e) => {
                      setFilters(prev => ({
                        ...prev,
                        duration: e.target.value
                      }));
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    {durationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters Button - Only show when filters are active */}
                {hasActiveFilters && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFilters({
                          level: [],
                          category: [],
                          duration: 'all',
                        });
                        setSearchQuery('');
                        setSearchParams({});
                      }}
                      className="text-sm text-primary-600 hover:text-primary-800"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => {}}
            />
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <h3 className="mt-2 text-lg font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
