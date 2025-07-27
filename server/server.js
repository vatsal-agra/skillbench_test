require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const enrollmentRoutes = require('./routes/enrollments');

const app = express();
const PORT = process.env.PORT || 5000;

// Database configuration
console.log('Initializing database...');
const { sequelize, syncDatabase, User } = require('./models');

// Sync database when server starts
async function startServer() {
  try {
    // In development, force sync to recreate tables
    // In production, use alter: true to safely update schema
    const syncOptions = {
      force: process.env.NODE_ENV !== 'production',
      alter: process.env.NODE_ENV === 'production'
    };

    await syncDatabase(syncOptions.force);
    console.log('✅ Database synchronized');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) throw new Error();

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// API Routes
console.log('Mounting enrollments routes at /api/enrollments');
app.use('/api/enrollments', (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}, enrollmentRoutes);

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).send({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).send({ token, user });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  console.log('Login attempt:', { email: req.body.email });
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).send({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    console.log('User found:', !!user);

    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).send({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).send({ error: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set');
      return res.status(500).send({ error: 'Server configuration error' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log('Login successful for user:', user.id);
    res.send({ 
      token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ error: 'An error occurred during login' });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  res.send(req.user);
});


