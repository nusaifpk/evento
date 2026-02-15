# Render Deployment Guide

## Overview
This document explains how the Doc-Ainager application is deployed on Render using the `render.yaml` configuration file.

## Render Configuration

### Service Details
- **Service Type**: Web Service
- **Name**: doc-ainager
- **Runtime**: Node.js
- **Plan**: Starter

### Build Process
- **Build Command**: `npm run render-build-only`
  - Installs dependencies (including dev dependencies)
  - Builds the React application for production
  - Creates optimized static assets in `dist/` directory

### Start Process
- **Start Command**: `npm run render-start`
  - Runs the Express server in standalone mode
  - Serves both API routes and static React files from the same port
  - Uses `STANDALONE_SERVER=true` environment variable

## Environment Variables

### Production Settings
- `NODE_ENV`: Set to `production`
- `NPM_CONFIG_PRODUCTION`: Set to `false` (allows dev dependencies for build)
- `STANDALONE_SERVER`: Set to `true` (enables standalone Express mode)
- `AWS_REGION`: Set to `us-east-1`

### Required Secrets (sync: false)
These variables must be configured manually in Render dashboard:
- `MONGODB_URI`: MongoDB connection string
- `GEMINI_API_KEY`: Google Gemini AI API key
- `JWT_SECRET`: JWT signing secret
- `CORS_ORIGIN`: Allowed CORS origins
- `AWS_ACCESS_KEY_ID`: AWS S3 access key
- `AWS_SECRET_ACCESS_KEY`: AWS S3 secret key
- `PORTAL_URL`: Application portal URL

## Deployment Architecture

### Single Port Deployment
The application uses a unified deployment approach where:
1. **Express Server** runs on the assigned port (typically 3000)
2. **Static Files** are served from `dist/` directory
3. **API Routes** are handled by Express middleware
4. **Client Routes** fall back to `index.html` for SPA functionality

### Build vs Runtime
- **Build Phase**: Creates optimized React build
- **Runtime Phase**: Express serves both API and static content
- **No Separate Client/Server**: Unified deployment reduces complexity

## Deployment Flow

1. **Code Push**: Git push triggers Render deployment
2. **Build Phase**: 
   - Install dependencies
   - Build React application
   - Create production-ready static assets
3. **Start Phase**:
   - Launch Express server
   - Configure middleware for API and static routes
   - Begin serving requests

## Advantages of This Approach

1. **Simplified Infrastructure**: Single service instead of separate client/server
2. **Cost Effective**: Only one web service needed
3. **Easy Scaling**: Single point of scaling
4. **Reduced Complexity**: No CORS issues between client and server
5. **Faster Deployment**: Single deployment pipeline

## Monitoring and Logs

- Render provides built-in monitoring for the web service
- Logs are available through the Render dashboard
- Health checks are automatically configured
- Auto-restart on crashes is enabled by default

## Scaling Considerations

- **Vertical Scaling**: Increase instance size for better performance
- **Horizontal Scaling**: Add more instances for load balancing
- **Database Scaling**: Consider MongoDB Atlas scaling for high traffic
- **CDN**: Consider CDN for static assets if needed

## Troubleshooting

### Common Issues
1. **Build Failures**: Check Node.js version compatibility
2. **Runtime Errors**: Verify all environment variables are set
3. **Database Connection**: Ensure MongoDB URI is correct and accessible
4. **API Errors**: Check CORS_ORIGIN configuration

### Debug Steps
1. Check Render build logs for build errors
2. Review runtime logs for startup issues
3. Verify environment variables in Render dashboard
4. Test API endpoints directly
5. Check database connectivity

## Security Notes

- All sensitive data is stored in environment variables
- No hardcoded secrets in the codebase
- CORS is properly configured
- JWT tokens are used for authentication
- AWS credentials are secured through environment variables
