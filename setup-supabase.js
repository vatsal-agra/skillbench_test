// @ts-check
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://cvmtjcbdxzefuzasqusa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2bXRqY2JkeHplZnV6YXNxdXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NDY1NzgsImV4cCI6MjA2NzMyMjU3OH0.5cf68BqCAZPqqdA8JyfF0t0A4rI3F2G0pUdPSY7s6Vc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Setting up database tables...');

    // Create profiles table (extends auth.users)
    const { data: profilesTable, error: profilesError } = await supabase
      .rpc('create_profiles_table');

    if (profilesError && profilesError.code !== '42P07') { // 42P07 is table already exists
      throw profilesError;
    }

    // Create courses table
    const { data: coursesTable, error: coursesError } = await supabase
      .rpc('create_courses_table');

    if (coursesError && coursesError.code !== '42P07') {
      throw coursesError;
    }

    // Create enrollments table
    const { data: enrollmentsTable, error: enrollmentsError } = await supabase
      .rpc('create_enrollments_table');

    if (enrollmentsError && enrollmentsError.code !== '42P07') {
      throw enrollmentsError;
    }

    console.log('✅ Database setup complete!');
    
    // Add some sample courses
    await addSampleCourses();
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  }
}

async function addSampleCourses() {
  const sampleCourses = [
    {
      title: 'Introduction to Web Development',
      description: 'Learn the basics of HTML, CSS, and JavaScript',
      instructor: 'Jane Smith',
      duration: '4 weeks',
      level: 'Beginner'
    },
    {
      title: 'Advanced React',
      description: 'Master React with hooks, context, and performance optimization',
      instructor: 'John Doe',
      duration: '6 weeks',
      level: 'Intermediate'
    },
    {
      title: 'Node.js Backend Development',
      description: 'Build scalable backend services with Node.js and Express',
      instructor: 'Alex Johnson',
      duration: '5 weeks',
      level: 'Intermediate'
    }
  ];

  const { data: existingCourses, error: fetchError } = await supabase
    .from('courses')
    .select('*');

  if (fetchError) throw fetchError;

  if (existingCourses.length === 0) {
    const { error: insertError } = await supabase
      .from('courses')
      .insert(sampleCourses);

    if (insertError) throw insertError;
    console.log('✅ Added sample courses');
  } else {
    console.log('ℹ️ Sample courses already exist');
  }
}

// Run the setup
setupDatabase();
