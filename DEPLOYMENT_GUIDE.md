# Evento Render Deployment Guide

## Overview
This document explains how to deploy the Evento application on Render using the `render.yaml` configuration file.

## Prerequisites

1. **GitHub Repository**: Ensure your Evento code is pushed to a GitHub repository
2. **Render Account**: Create an account at [render.com](https://render.com)
3. **MongoDB Atlas**: Set up a MongoDB cluster for the database
4. **Environment Variables**: Have all required API keys and secrets ready

## Render Configuration

### Service Details
- **Service Type**: Web Service
- **Name**: evento
- **Runtime**: Node.js
- **Plan**: Starter

### Build Process
- **Build Command**: `npm run render-build-only`
  - Installs dependencies (including dev dependencies)
  - Builds the React application for production
  - Creates optimized static assets in `client/dist/` directory

### Start Process
- **Start Command**: `npm run render-start`
  - Runs the Express server in standalone mode
  - Serves both API routes and static React files from the same port
  - Uses `STANDALONE_SERVER=true` environment variable

## Environment Variables

### Production Settings (automatically configured)
- `NODE_ENV`: Set to `production`
- `NPM_CONFIG_PRODUCTION`: Set to `false` (allows dev dependencies for build)
- `STANDALONE_SERVER`: Set to `true` (enables standalone Express mode)
- `AWS_REGION`: Set to `us-east-1`

### Required Secrets (must be configured manually in Render dashboard)
- `MONGODB_URI`: MongoDB connection string from MongoDB Atlas
- `JWT_SECRET`: JWT signing secret (generate a secure random string)
- `CORS_ORIGIN`: Your Render app URL (e.g., `https://evento.onrender.com`)

## Deployment Architecture

### Single Port Deployment
The application uses a unified deployment approach where:
1. **Express Server** runs on the assigned port (typically 3000)
2. **Static Files** are served from `client/dist/` directory
3. **API Routes** are handled by Express middleware
4. **Client Routes** fall back to `index.html` for SPA functionality

### Build vs Runtime
- **Build Phase**: Creates optimized React build in `client/dist/`
- **Runtime Phase**: Express serves both API and static content
- **No Separate Client/Server**: Unified deployment reduces complexity

## Step-by-Step Deployment

### 1. Prepare Your Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Configure for Render deployment"
git push origin main
```

### 2. Create Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `evento` repository
5. Configure the service:
   - **Name**: `evento`
   - **Runtime**: `Node`
   - **Build Command**: `npm run render-build-only`
   - **Start Command**: `npm run render-start`

### 3. Configure Environment Variables
In your Render service settings, add the following environment variables:

#### Required Secrets
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Generate using: `openssl rand -base64 32`
- `CORS_ORIGIN`: `https://your-service-name.onrender.com`

#### Optional Variables
- `NODE_ENV`: `production` (usually set automatically)
- `PORT`: `3000` (Render sets this automatically)

### 4. Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Monitor the build logs for any issues

## Deployment Flow

1. **Code Push**: Git push triggers Render deployment
2. **Build Phase**: 
   - Install dependencies
   - Build React application to `client/dist/`
   - Create production-ready static assets
3. **Start Phase**:
   - Launch Express server
   - Configure middleware for API and static routes
   - Begin serving requests

## API Endpoints

### Health Check
- `GET /api/health` - Service health status

### Events
- `GET /api/events/nearby?lat=X&lng=Y` - Get nearby events
- `GET /api/events/:id` - Get event by ID

## MongoDB Setup

### 1. Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster (M0 free tier is sufficient for development)
3. Create a database user
4. Configure network access (allow all IPs for simplicity: `0.0.0.0/0`)

### 2. Get Connection String
1. In Atlas, go to "Database" → "Connect" → "Drivers"
2. Copy the connection string
3. Replace `<password>` with your database user password
4. Use this as `MONGODB_URI` in Render

## Troubleshooting

### Common Issues

#### Build Failures
- Check Node.js version compatibility (Render uses Node.js 18+)
- Verify all dependencies are properly installed
- Check build logs in Render dashboard

#### Runtime Errors
- Verify all environment variables are set correctly
- Check MongoDB connection string format
- Ensure CORS_ORIGIN matches your Render URL

#### Database Connection Issues
- Verify MongoDB Atlas cluster is running
- Check network access configuration
- Ensure database user has correct permissions
- Test connection string locally first

### Debug Steps
1. Check Render build logs for build errors
2. Review runtime logs for startup issues
3. Verify environment variables in Render dashboard
4. Test API endpoints directly
5. Check database connectivity

### Common Log Messages
- `✅ MongoDB Connected: [host]` - Database connection successful
- `🚀 Evento server running on port 3000` - Server started successfully
- `📱 Serving static files from: client/dist` - Static file serving enabled

## Monitoring and Maintenance

### Render Monitoring
- Built-in metrics and logs available in dashboard
- Auto-restart on crashes enabled by default
- Health checks automatically configured

### Database Monitoring
- Monitor MongoDB Atlas metrics
- Set up alerts for high usage
- Regular backups are handled by Atlas

## Scaling Considerations

### Application Scaling
- **Vertical Scaling**: Increase instance size in Render dashboard
- **Horizontal Scaling**: Add more instances for load balancing

### Database Scaling
- Consider upgrading MongoDB Atlas tier for high traffic
- Implement caching strategies if needed
- Monitor query performance

## Security Notes

- All sensitive data is stored in environment variables
- No hardcoded secrets in the codebase
- CORS is properly configured
- JWT tokens are used for authentication
- MongoDB credentials are secured through environment variables

## Post-Deployment Checklist

- [ ] Application loads correctly in browser
- [ ] API endpoints respond correctly
- [ ] Database connection is working
- [ ] Static assets are loading
- [ ] Error handling works properly
- [ ] Logs are being generated
- [ ] Health check endpoint is accessible

## Local Development vs Production

### Local Development
```bash
npm run dev          # Start development server
npm run server       # Start API server only
npm run client       # Start React dev server only
```

### Production (Render)
```bash
npm run render-build-only  # Build for production
npm run render-start       # Start production server
```

## Support

For issues related to:
- **Render Platform**: Contact Render support
- **MongoDB Atlas**: Contact MongoDB support
- **Application Code**: Check GitHub issues or create new ones
