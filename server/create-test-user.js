const bcrypt = require('bcryptjs');
const { User } = require('./models');

async function createTestUser() {
  try {
    const email = 'test@example.com';
    const password = 'password123';
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('Test user already exists:', existingUser.email);
      return existingUser;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);
    
    // Create test user
    const user = await User.create({
      name: 'Test User',
      email,
      password: hashedPassword
    });
    
    console.log('✅ Test user created:', {
      id: user.id,
      email: user.email,
      name: user.name
    });
    
    return user;
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    throw error;
  }
}

// Run the function
createTestUser()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
