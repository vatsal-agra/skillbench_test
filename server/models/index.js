const { Sequelize } = require('sequelize');
const path = require('path');

// Create a new database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Course = sequelize.define('Course', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  price: {
    type: Sequelize.FLOAT,
    defaultValue: 1.00, // $1.00 default price
  },
});

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  courseId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Courses',
      key: 'id',
    },
  },
  enrolledAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  status: {
    type: Sequelize.ENUM('active', 'completed', 'failed'),
    defaultValue: 'active',
  },
});

// Define associations - Many-to-Many relationship between User and Course through Enrollment
User.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: 'userId',
  as: 'enrolledCourses'
});

Course.belongsToMany(User, {
  through: Enrollment,
  foreignKey: 'courseId',
  as: 'enrolledUsers'
});

// Direct associations for easier querying
Enrollment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Enrollment.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});

// One-to-Many relationships
User.hasMany(Enrollment, {
  foreignKey: 'userId',
  as: 'enrollments'
});

Course.hasMany(Enrollment, {
  foreignKey: 'courseId',
  as: 'enrollments'
});

// Database sync function
async function syncDatabase(force = false) {
  try {
    await sequelize.authenticate();
    console.log('🔌 Database connection established');
    
    // Sync all models with the provided options
    const options = { 
      force,
      logging: console.log
    };
    
    await sequelize.sync(options);
    console.log('🔄 Database synchronized');
    
    // Log all tables
    const [tables] = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    
    if (tables.length > 0) {
      console.log('📊 Database tables:', tables.map(t => t.name).join(', '));
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    throw error;
  }
}



module.exports = {
  sequelize,
  User,
  Course,
  Enrollment,
  syncDatabase
};
