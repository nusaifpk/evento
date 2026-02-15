import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './src/config/mongo.js';
import { Event } from './src/modules/event/event.model.js';

dotenv.config();

const clearDatabase = async (): Promise<void> => {
  try {
    await connectDB();

    // Clear all events
    const result = await Event.deleteMany({});
    console.log(`🗑️  Cleared ${result.deletedCount} events from database`);

    await disconnectDB();
    console.log('✅ Database cleared successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    await disconnectDB();
    process.exit(1);
  }
};

clearDatabase();
