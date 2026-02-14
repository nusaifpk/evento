# 🚀 Deployment Guide for Evento

## Current Architecture

- **Frontend**: React app deployed on Netlify
- **Backend**: Express server (needs separate deployment)

## Problem

Netlify only serves static files. Your Express backend needs to be deployed separately.

## Solution Options

### Option 1: Deploy Backend Separately (Recommended)

Deploy your Express server to one of these platforms:

#### A. Railway (Easiest)
1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select your repository
4. Set root directory to `server`
5. Add environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `NODE_ENV=production`
   - `PORT` (Railway auto-assigns, but you can set it)
6. Railway will give you a URL like: `https://your-app.railway.app`
7. In Netlify, set `VITE_API_URL=https://your-app.railway.app/api`

#### B. Render
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Set:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run dev` (or create a production start script)
5. Add environment variables (same as Railway)
6. Render gives you: `https://your-app.onrender.com`
7. In Netlify, set `VITE_API_URL=https://your-app.onrender.com/api`

#### C. Fly.io
1. Install Fly CLI: `npm install -g @fly/cli`
2. In `server` directory: `fly launch`
3. Follow prompts
4. Deploy: `fly deploy`
5. Get URL and set in Netlify

### Option 2: Use Netlify Functions (Serverless)

Convert your Express routes to Netlify Functions. This is more complex but keeps everything on Netlify.

## Quick Fix: Update Environment Variable

**Current (Wrong):**
```
VITE_API_URL=https://event00.netlify.app/
```

**Should be (after deploying backend):**
```
VITE_API_URL=https://your-backend-domain.com/api
```

## Steps to Fix Right Now

1. **Deploy your backend** to Railway, Render, or similar
2. **Get the backend URL** (e.g., `https://evento-api.railway.app`)
3. **Update Netlify environment variable**:
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Update `VITE_API_URL` to: `https://your-backend-url.com/api`
4. **Redeploy** your Netlify site

## Testing

After deployment, test:
- Frontend: `https://event00.netlify.app/`
- Backend API: `https://your-backend-url.com/api/health`
- Should return: `{"success":true,"message":"Evento API is running",...}`

## Production Backend Setup

Make sure your `server/package.json` has a production start script:

```json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "dev": "tsx src/server.ts"
  }
}
```

Then build and start:
```bash
cd server
npm run build
npm start
```

