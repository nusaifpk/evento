import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDB } from './src/config/mongo.js';
import eventRoutes from './src/modules/event/event.routes.js';
import adminRoutes from './src/modules/admin/admin.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Evento API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from client/dist in production
if (process.env.NODE_ENV === 'production' || process.env.STANDALONE_SERVER === 'true') {
  const distPath = join(__dirname, '../client/dist');
  app.use(express.static(distPath));
  
  // Serve React app for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(distPath, 'index.html'));
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
  });
});

// Connect to MongoDB
connectDB().catch((error) => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Evento server running on port ${PORT}`);
  console.log(`📱 Serving static files from: ${process.env.STANDALONE_SERVER === 'true' ? 'client/dist' : 'development mode'}`);
});
