import express, { Request, Response, NextFunction } from 'express';
import { connectDB } from './config/mongo.js';
import eventRoutes from './modules/event/event.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Create Express app
const app = express();

// Initialize database connection (will be called when app is imported)
let dbConnected = false;

async function initializeDB() {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
}

// Initialize DB on first use
initializeDB().catch(console.error);

// API Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (with /api prefix for production, without for Vite middleware)
// Handle both /events and /events/ paths
app.use('/api/events', eventRoutes);
app.use('/api/events/', eventRoutes);
app.use('/events', eventRoutes);
app.use('/events/', eventRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);
console.log('[Express] Admin routes registered at /admin');

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Evento API is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Evento API is running',
    timestamp: new Date().toISOString(),
  });
});

// Catch-all for unmatched API routes - return 404 JSON
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: 'API route not found',
    path: req.path,
  });
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;
