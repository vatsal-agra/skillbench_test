const { Course } = require('./models');

async function createTestCourse() {
  try {
    // Create a test course
    const course = await Course.create({
      title: 'Test Course',
      description: 'This is a test course for enrollment testing',
      price: 1.00
    });
    
    console.log('✅ Test course created:', {
      id: course.id,
      title: course.title,
      price: course.price
    });
    
    return course;
  } catch (error) {
    console.error('❌ Error creating test course:', error);
    throw error;
  }
}

createTestCourse()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
