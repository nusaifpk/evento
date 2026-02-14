# Deployment Guide

## Netlify Deployment

### Frontend (Static Site)

The frontend can be deployed to Netlify as a static site. The `netlify.toml` file is already configured.

**Build Settings in Netlify:**
- Build command: `npm ci && npm run build` (already in netlify.toml)
- Publish directory: `dist` (already in netlify.toml)
- Node version: 20 (already in netlify.toml)

**Environment Variables:**
Set these in Netlify dashboard (Site settings > Environment variables):
- `VITE_API_URL` - Your backend API URL (e.g., `https://your-backend.railway.app/api` or `https://your-backend.render.com/api`)
- `GEMINI_API_KEY` - (Optional, for future AI features)

### Backend Deployment

The backend (Express + MongoDB) needs to be deployed separately. Options:

1. **Railway** (Recommended)
   - Connect your GitHub repo
   - Set root directory to project root
   - Add MongoDB service
   - Set environment variables:
     - `MONGODB_URI` - Your MongoDB connection string
     - `PORT` - (usually auto-set)
     - `NODE_ENV=production`

2. **Render**
   - Create a new Web Service
   - Build command: `npm install`
   - Start command: `node server/index.js` (you may need to create a production server file)
   - Add MongoDB service
   - Set environment variables

3. **Vercel** (Serverless Functions)
   - Would require converting Express routes to serverless functions

### Important Notes

1. **API URL Configuration:**
   - In development: API uses `/api` (relative path, works with dev-server.ts)
   - In production: Set `VITE_API_URL` environment variable in Netlify to point to your deployed backend

2. **CORS:**
   - Make sure your backend allows requests from your Netlify domain
   - Add CORS middleware in Express if needed

3. **MongoDB:**
   - Use MongoDB Atlas (cloud) for production
   - Update `MONGODB_URI` in your backend environment variables

### Quick Deploy Steps

1. **Deploy Backend:**
   ```bash
   # On Railway/Render:
   # - Connect GitHub repo
   # - Set MONGODB_URI
   # - Deploy
   ```

2. **Deploy Frontend:**
   ```bash
   # On Netlify:
   # - Connect GitHub repo
   # - Set VITE_API_URL to your backend URL
   # - Deploy
   ```

3. **Test:**
   - Visit your Netlify URL
   - Check browser console for API errors
   - Verify events are loading

