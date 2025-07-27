const fs = require('fs');
const path = require('path');
const { sequelize, syncDatabase } = require('./models');

async function resetDatabase() {
  try {
    // Close any existing connections
    await sequelize.close();
    
    // Delete the database file if it exists
    const dbPath = path.join(__dirname, 'database.sqlite');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('🗑️  Deleted existing database file');
    }
    
    // Reconnect and sync with force: true
    console.log('🔄 Creating fresh database...');
    await syncDatabase(true);
    
    console.log('\n✅ Database reset complete!');
    console.log('   Tables created:', Object.keys(sequelize.models).join(', '));
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the reset
resetDatabase();
