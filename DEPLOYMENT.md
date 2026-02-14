# 🚀 Deployment Guide for Evento on Render

## Architecture

- **Frontend**: React app deployed as web service on Render
- **Backend**: Express server deployed as web service on Render

## Deployment Steps

### Option 1: Using Render Blueprint (Recommended)

1. **Push your code to GitHub**
2. **Go to [Render Dashboard](https://dashboard.render.com)**
3. **Click "New +" → "Blueprint"**
4. **Connect your GitHub repository**
5. **Render will detect `render.yaml` and create both services automatically**
6. **Set environment variables in Render dashboard:**
   - For `evento-api` service:
     - `MONGODB_URI` - Your MongoDB connection string
     - `NODE_ENV=production`
   - For `evento-frontend` service:
     - `VITE_API_URL` - Update to your backend URL (e.g., `https://evento-api.onrender.com/api`)

### Option 2: Manual Deployment

#### Deploy Backend (API Service)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `evento-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start`
5. Add environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `NODE_ENV=production`
   - `PORT=10000` (Render sets this automatically, but you can specify)
6. Click "Create Web Service"
7. Note the service URL (e.g., `https://evento-api.onrender.com`)

#### Deploy Frontend (Web Service)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `evento-frontend`
   - **Root Directory**: `client`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
5. Add environment variables:
   - `VITE_API_URL` - Set to `https://evento-api.onrender.com/api` (use your actual backend URL)
   - `NODE_ENV=production`
   - `PORT=10000` (Render sets this automatically)
6. Click "Create Web Service"

## Environment Variables

### Backend (`evento-api`)
```
MONGODB_URI=mongodb+srv://...
NODE_ENV=production
PORT=10000
```

### Frontend (`evento-frontend`)
```
VITE_API_URL=https://evento-api.onrender.com/api
```

## Testing

After deployment, test:
- Backend API: `https://evento-api.onrender.com/api/health`
  - Should return: `{"success":true,"message":"Evento API is running",...}`
- Frontend: `https://evento-frontend.onrender.com/`
  - Should load the React app and connect to the backend

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

