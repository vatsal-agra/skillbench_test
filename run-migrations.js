import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// ES Module equivalents for __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase clients
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY; // Add this to your .env

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Required Supabase environment variables are missing');
}

// Use the anon key for normal operations
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Use service role key for admin operations (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// PostgreSQL client for migrations
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('Running migrations...');
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20230706000000_setup_tables.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    await client.query(sql);
    
    console.log('✅ Migrations completed successfully!');
  } finally {
    client.release();
  }
}

async function addSampleCourses() {
  try {
    console.log('Adding sample courses...');
    
    const sampleCourses = [
      {
        title: 'Introduction to React',
        description: 'Learn the basics of React',
        instructor: 'John Doe',
        duration: '4 weeks',
        level: 'Beginner',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        title: 'Advanced JavaScript',
        description: 'Master advanced JavaScript concepts',
        instructor: 'Jane Smith',
        duration: '6 weeks',
        level: 'Advanced',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        title: 'Full Stack Development',
        description: 'Build full stack applications',
        instructor: 'Mike Johnson',
        duration: '8 weeks',
        level: 'Intermediate',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    // First, check if we have any courses already
    const { data: existingCourses, error: fetchError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .limit(1);
      
    if (fetchError) {
      console.error('Error checking for existing courses:', fetchError);
      throw fetchError;
    }
    
    if (existingCourses && existingCourses.length > 0) {
      console.log('ℹ️ Courses already exist, skipping sample data insertion');
      return;
    }
    
    // Add courses one by one to handle potential duplicates
    for (const course of sampleCourses) {
      console.log(`Adding course: ${course.title}`);
      const { data, error } = await supabaseAdmin
        .from('courses')
        .insert(course)
        .select()
        .single();
        
      if (error) {
        if (error.code === '23505') { // Unique violation
          console.log(`ℹ️ Course already exists: ${course.title}`);
        } else {
          console.error(`❌ Error adding course ${course.title}:`, error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          throw error;
        }
      } else {
        console.log(`✅ Added course: ${course.title}`);
      }
    }
    
    console.log('✅ Sample courses process completed');
  } catch (error) {
    console.error('Error in addSampleCourses:', error);
    throw error;
  }
}

async function main() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found in .env file.');
      console.log('Please get it from your Supabase dashboard: Project Settings > Database > Connection string (URI)');
      process.exit(1);
    }
    await runMigrations();
    await addSampleCourses();
    console.log('🎉 Supabase setup complete!');
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
