# 🚀 Render Dashboard Settings Guide

## Step-by-Step Configuration

### 1. Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub/GitLab/Bitbucket repository
4. Select your repository: `nusaifpk/evento`

---

## 2. Basic Settings

### Service Details
- **Name**: `evento` (or any name you prefer)
- **Environment**: `Node`
- **Region**: Choose closest to your users (e.g., `Oregon (US West)`, `Frankfurt (EU)`)
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave **empty** (uses root directory)

---

## 3. Build & Deploy Settings

### Build Command
```
npm run install:all && npm run build:all && npm run build:server
```

### Start Command
```
npm run start:prod
```

### Plan
- Select **Free** (or upgrade to Starter/Standard if needed)

---

## 4. Environment Variables

Click on **"Environment"** tab and add:

### Required Variables

| Key | Value | Description |
|-----|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/dbname` | Your MongoDB connection string (from MongoDB Atlas) |
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` | Server port (optional, Render sets this automatically) |

### How to Get MongoDB URI:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with your database name (e.g., `evento`)

**Example:**
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/evento?retryWrites=true&w=majority
```

---

## 5. Advanced Settings (Optional)

### Health Check Path
- **Path**: `/api/health`
- This allows Render to monitor if your app is running

### Auto-Deploy
- ✅ **Auto-Deploy**: Enabled (deploys on every push to main branch)

### Build Cache
- ✅ **Build Cache**: Enabled (speeds up builds)

---

## 6. Summary of Settings

```
Service Name: evento
Environment: Node
Region: [Choose closest]
Branch: main
Root Directory: (empty)

Build Command: npm run install:all && npm run build:all && npm run build:server
Start Command: npm run start:prod

Environment Variables:
  - MONGODB_URI: [Your MongoDB connection string]
  - NODE_ENV: production
  - PORT: 10000

Health Check: /api/health
Plan: Free
```

---

## 7. Alternative: Using render.yaml (Auto-Detection)

If you have `render.yaml` in your repository (which you do), Render will **auto-detect** it and pre-fill most settings. You'll only need to:

1. Connect your repository
2. Render will detect `render.yaml`
3. **Set the `MONGODB_URI` environment variable** (this is the only thing you need to add manually)
4. Click **"Create Web Service"**

The `render.yaml` file already contains:
- Build command
- Start command
- Health check path
- Other environment variables (except MONGODB_URI which you must set)

---

## 8. After Deployment

Once deployed, your app will be available at:
```
https://evento.onrender.com
```
(Or whatever name you chose)

### Test Your Deployment

1. **Health Check**: `https://evento.onrender.com/api/health`
   - Should return: `{"success": true, "message": "Evento API is running", ...}`

2. **Home Page**: `https://evento.onrender.com`
   - Should show your React app

3. **API Test**: `https://evento.onrender.com/api/events`
   - Should return events from your database

---

## 9. Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Verify all environment variables are set
- Ensure MongoDB URI is correct

### App Won't Start
- Check runtime logs
- Verify `MONGODB_URI` is set correctly
- Check that MongoDB allows connections from Render IPs (MongoDB Atlas Network Access)

### Database Connection Issues
- In MongoDB Atlas, go to **Network Access**
- Add **"Allow Access from Anywhere"** (0.0.0.0/0) or Render's IP ranges
- Verify database user has correct permissions

---

## Quick Checklist

- [ ] Repository connected
- [ ] Build command set (or auto-detected from render.yaml)
- [ ] Start command set (or auto-detected from render.yaml)
- [ ] `MONGODB_URI` environment variable added
- [ ] `NODE_ENV` set to `production` (optional, auto-set)
- [ ] Health check path set to `/api/health` (optional, auto-set)
- [ ] MongoDB Atlas network access configured
- [ ] Service created and deploying

---

## Need Help?

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- Check build logs in Render dashboard for specific errors

