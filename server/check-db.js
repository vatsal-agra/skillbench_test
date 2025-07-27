const { sequelize } = require('./models');
const fs = require('fs');
const path = require('path');

async function checkDatabase() {
  try {
    // Check if database file exists
    const dbPath = path.join(__dirname, 'database.sqlite');
    console.log('Database path:', dbPath);
    console.log('Database file exists:', fs.existsSync(dbPath));
    
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Check if tables exist
    const [results] = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );
    console.log('Tables in database:', results.map(r => r.name));
    
    // Check if Users table has data
    const userCount = await sequelize.models.User.count();
    console.log(`Users in database: ${userCount}`);
    
    // Check if Courses table has data
    const courseCount = await sequelize.models.Course.count();
    console.log(`Courses in database: ${courseCount}`);
    
    // Check if Enrollments table has data
    const enrollmentCount = await sequelize.models.Enrollment.count();
    console.log(`Enrollments in database: ${enrollmentCount}`);
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await sequelize.close();
  }
}

checkDatabase();
