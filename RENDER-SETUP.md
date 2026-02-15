# Render Deployment Guide for Evento

## Quick Setup

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Create Render Services

#### Backend Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: evento-backend
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

#### Frontend Service
1. Click "New +" → "Static Site"
2. Same repository
3. Configure:
   - **Name**: evento-frontend
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Instance Type**: Free

#### Database
1. Click "New +" → "PostgreSQL" or "MongoDB"
2. **Name**: evento-db
3. **Database Name**: evento
4. **User**: evento

### 3. Environment Variables

#### Backend Environment Variables
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your-render-db-connection-string
JWT_SECRET=your-jwt-secret-key
```

#### Frontend Environment Variables
```
VITE_API_URL=https://evento-backend.onrender.com
```

### 4. Update API URLs

In your frontend code, make sure API calls use:
```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

## Alternative: Single Service Deployment

If you prefer one service, use the provided `render.yaml` file:

1. Add the render.yaml to your repo root
2. In Render, click "New Blueprint"
3. Connect your repo
4. Render will automatically create all services

## Important Notes

- **Port**: Render uses port 10000 by default
- **Health Check**: Your backend already has `/api/health` endpoint
- **Database**: Use Render's managed MongoDB for best results
- **Build**: Backend compiles TypeScript to `dist/` folder
- **CORS**: Make sure your backend allows your frontend URL

## Troubleshooting

### Backend fails to start
- Check that `server/package.json` has the correct start script
- Verify TypeScript compilation creates `dist/server.js`

### Frontend can't reach backend
- Ensure `VITE_API_URL` is set correctly
- Check CORS settings in your Express app

### Database connection issues
- Verify MongoDB URI format
- Check that database user has correct permissions
- Ensure IP whitelist allows Render's IPs (0.0.0.0/0)
