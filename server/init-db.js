const { sequelize, User, Course, Enrollment } = require('./models');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  try {
    console.log('Initializing database with sample data...');

    // Create sample courses
    const courses = await Course.bulkCreate([
      {
        title: 'Web Development Bootcamp',
        description: 'Master modern web development with React, Node.js, and MongoDB in this comprehensive bootcamp.',
        price: 1.00
      },
      {
        title: 'Data Science Fundamentals',
        description: 'Learn the basics of data science, including Python, Pandas, and data visualization.',
        price: 1.00
      },
      {
        title: 'Mobile App Development',
        description: 'Build cross-platform mobile apps with React Native and Firebase.',
        price: 1.00
      }
    ], { returning: true });

    console.log('Created courses:', courses.map(c => c.title));

    // Create a test user if doesn't exist
    const [user, created] = await User.findOrCreate({
      where: { email: 'test@example.com' },
      defaults: {
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10)
      }
    });

    console.log(created ? 'Created test user' : 'Test user already exists');

    // Enroll test user in first course
    if (created) {
      await Enrollment.create({
        userId: user.id,
        courseId: courses[0].id,
        status: 'active'
      });
      console.log('Enrolled test user in first course');
    }

    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
