import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './config/mongo.js';
import eventRoutes from './modules/event/event.routes.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../../client');

async function createServer() {
  const app = express();

  // Connect to MongoDB
  await connectDB();

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    root,
    appType: 'spa',
    configFile: path.resolve(root, 'vite.config.ts'),
  });

  // API Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api/events', eventRoutes);

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Evento API is running',
      timestamp: new Date().toISOString(),
    });
  });

  // Use Vite's connect-express middleware
  app.use(vite.middlewares);

  // Error handling
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  });

  return app;
}

createServer()
  .then((app) => {
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📱 Frontend: http://localhost:${PORT}`);
      console.log(`🔌 API: http://localhost:${PORT}/api`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use!`);
        console.error(`\nTo fix this, run:`);
        console.error(`  netstat -ano | findstr :${PORT}`);
        console.error(`  taskkill /PID <PID> /F\n`);
        process.exit(1);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
