# Evento Render Deployment Checklist

## Pre-Deployment Checklist

### ✅ Repository Setup
- [ ] All code is committed to GitHub
- [ ] Repository is public or accessible by Render
- [ ] `render.yaml` file exists in root directory
- [ ] `.gitignore` excludes `node_modules` and build artifacts

### ✅ Configuration Files
- [ ] `render.yaml` configured with correct repository URL
- [ ] `package.json` has `render-build-only` script
- [ ] `package.json` has `render-start` script
- [ ] `server/standalone-server.js` exists and configured
- [ ] Environment variables documented in `DEPLOYMENT_GUIDE.md`

### ✅ Build Configuration
- [ ] Client builds successfully: `cd client && npm run build`
- [ ] Server starts in standalone mode: `npm run render-start`
- [ ] All API endpoints work correctly
- [ ] Static files are served properly

### ✅ Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user configured
- [ ] Network access configured (0.0.0.0/0 for testing)
- [ ] Connection string tested locally

## Render Deployment Steps

### 1. Create Render Service
- [ ] Login to Render dashboard
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Configure service settings:
  - Name: `evento`
  - Runtime: `Node`
  - Build Command: `npm run render-build-only`
  - Start Command: `npm run render-start`

### 2. Environment Variables
- [ ] `MONGODB_URI`: MongoDB Atlas connection string
- [ ] `JWT_SECRET`: Generated secure random string
- [ ] `CORS_ORIGIN`: `https://evento.onrender.com` (update with actual URL)

### 3. Deploy
- [ ] Click "Create Web Service"
- [ ] Monitor build logs
- [ ] Verify deployment success

## Post-Deployment Verification

### ✅ Basic Functionality
- [ ] Application loads in browser
- [ ] Health check endpoint works: `GET /api/health`
- [ ] Static assets load correctly
- [ ] React app renders properly

### ✅ API Testing
- [ ] `GET /api/events` - Returns all events
- [ ] `GET /api/events/nearby?lat=X&lng=Y` - Returns nearby events
- [ ] `GET /api/events/:id` - Returns specific event
- [ ] Admin endpoints work (if accessible)

### ✅ Database Connection
- [ ] MongoDB connection established
- [ ] Data persists correctly
- [ ] No database errors in logs

### ✅ Error Handling
- [ ] 404 errors handled gracefully
- [ ] 500 errors return proper JSON
- [ ] CORS headers configured correctly

## Troubleshooting Common Issues

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies install correctly
- Check build logs in Render dashboard

### Runtime Errors
- Verify environment variables are set
- Check MongoDB connection string format
- Ensure CORS_ORIGIN matches actual URL

### Database Issues
- Test MongoDB Atlas connection locally
- Check network access settings
- Verify database user permissions

## Performance Optimization (Optional)

- [ ] Enable Gzip compression
- [ ] Implement caching strategies
- [ ] Optimize database queries
- [ ] Monitor resource usage

## Security Checklist

- [ ] No hardcoded secrets in code
- [ ] Environment variables are secure
- [ ] CORS configured properly
- [ ] JWT secrets are strong
- [ ] Database access is restricted

## Monitoring Setup

- [ ] Enable Render monitoring
- [ ] Set up log alerts
- [ ] Configure database monitoring
- [ ] Set up uptime monitoring

## Rollback Plan

- [ ] Previous working version tagged in Git
- [ ] Database backup strategy
- [ ] Quick rollback procedure documented

---

## Quick Commands

### Local Testing
```bash
# Test build process
npm run render-build-only

# Test standalone server
npm run render-start

# Test API endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/events
```

### MongoDB Connection Test
```bash
# Test connection string locally
mongosh "your-mongodb-uri"
```

### Generate JWT Secret
```bash
openssl rand -base64 32
```

---

## Deployment URLs

After deployment, your application will be available at:
- **Main App**: `https://evento.onrender.com`
- **API Health**: `https://evento.onrender.com/api/health`
- **API Docs**: Test endpoints directly

Update this checklist with your actual URLs once deployed!
