import express, { Request, Response, NextFunction } from 'express';
import { connectDB } from './config/mongo.js';
import eventRoutes from './modules/event/event.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function createServer() {
  const app = express();

  // Connect to MongoDB
  await connectDB();

  // API Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api/events', eventRoutes);
  app.use('/api/admin', adminRoutes);

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Evento API is running',
      timestamp: new Date().toISOString(),
    });
  });

  // Serve static files in production
  if (NODE_ENV === 'production') {
    const clientDistPath = path.resolve(__dirname, '../../client/dist');
    app.use(express.static(clientDistPath));
    
    // SPA fallback - serve index.html for all non-API routes
    app.get('*', (req: Request, res: Response) => {
      // Don't serve index.html for API routes
      if (req.path.startsWith('/api')) {
        return res.status(404).json({
          success: false,
          error: 'API route not found',
          path: req.path,
        });
      }
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  } else {
    // Development: Use Vite middleware
    const { createServer as createViteServer } = await import('vite');
    const root = path.resolve(__dirname, '../../client');
    
    const vite = await createViteServer({
      server: { middlewareMode: true },
      root,
      appType: 'spa',
      configFile: path.resolve(root, 'vite.config.ts'),
    });
    
    app.use(vite.middlewares);
  }

  // Error handling
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: NODE_ENV === 'development' ? err.message : undefined,
    });
  });

  return app;
}

createServer()
  .then((app) => {
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      if (NODE_ENV === 'production') {
        console.log(`📱 Frontend: http://localhost:${PORT}`);
      }
      console.log(`🔌 API: http://localhost:${PORT}/api`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use!`);
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
