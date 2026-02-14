import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Plugin to mount Express app at /api
function expressMiddleware(): Plugin {
  return {
    name: 'express-middleware',
    enforce: 'pre', // Run before other plugins to ensure it's registered first
    async configureServer(server) {
      // Dynamically import Express app
      console.log('[Vite Plugin] Loading Express app...');
      const expressApp = (await import('../server/src/app.js')).default;
      console.log('[Vite Plugin] Express app loaded successfully');
      
      // Mount Express at /api - must be before Vite's SPA fallback
      // IMPORTANT: This must be registered BEFORE Vite's default middleware
      server.middlewares.use('/api', (req, res, next) => {
          // Store original URL and method
          const originalUrl = req.url || '/';
          const originalMethod = req.method;
          
          // Remove /api prefix before passing to Express
          const expressPath = originalUrl.replace(/^\/api/, '') || '/';
          req.url = expressPath;
          
          // Log for debugging
          console.log(`[Express Middleware] ${originalMethod} ${originalUrl} -> ${expressPath}`);
          
          // Track if response was sent
          let responseSent = false;
          
          // Override res methods to track response
          const originalEnd = res.end;
          const originalWrite = res.write;
          const originalWriteHead = res.writeHead;
          const originalSetHeader = res.setHeader;
          
          // Track headers being set
          const headers: Record<string, string | string[]> = {};
          res.setHeader = function(name: string, value: string | string[]) {
            headers[name] = value;
            return originalSetHeader.call(this, name, value);
          };
          
          res.writeHead = function(statusCode: number, statusMessage?: any, headersObj?: any) {
            responseSent = true;
            return originalWriteHead.call(this, statusCode, statusMessage, headersObj);
          };
          
          res.write = function(chunk: any, encoding?: any, cb?: any) {
            responseSent = true;
            return originalWrite.call(this, chunk, encoding, cb);
          };
          
          res.end = function(chunk?: any, encoding?: any, cb?: any) {
            responseSent = true;
            return originalEnd.call(this, chunk, encoding, cb);
          };
          
          // Handle Express app - it will call next() if no route matches
          // We intercept to prevent falling through to Vite
          // Note: We track responses through writeHead, write, and end overrides above
          // Express's res.json() and res.send() will eventually call these methods
          
          expressApp(req, res, (err?: any) => {
            // Restore original URL
            req.url = originalUrl;
            req.method = originalMethod;
            
            if (err) {
              console.error('[Express] Error:', err);
              if (!responseSent && !res.headersSent) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal server error', details: err.message }));
              }
            } else if (!responseSent && !res.headersSent) {
              // Express called next() but didn't send response - return 404
              console.log(`[Express] Route not handled: ${expressPath}`);
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'API route not found', path: expressPath }));
            }
            // NEVER call next() - we always handle /api requests here
          });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        allowedHosts: ['observable-joe-moistful.ngrok-free.dev'],
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), expressMiddleware()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
