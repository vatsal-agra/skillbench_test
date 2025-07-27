const { User } = require('./models');
const bcrypt = require('bcryptjs');

async function createUser() {
  try {
    const email = 'test@example.com';
    const password = 'password123';
    
    // Delete existing user if any
    await User.destroy({ where: { email } });
    
    // Create new user
    const user = await User.create({
      name: 'Test User',
      email,
      password: await bcrypt.hash(password, 8)
    });
    
    console.log('✅ User created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    process.exit(1);
  }
}

createUser();
