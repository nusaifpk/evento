import app from './app.js';
import { connectDB } from './config/mongo.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('✅ MongoDB Connected');
    
    // Start server
    const PORT = process.env.PORT || 10000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔌 API: http://localhost:${PORT}/api`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      console.error('Server error:', error);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

