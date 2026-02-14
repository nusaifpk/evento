# Netlify Deployment Setup Guide

## Overview

This project is configured to run both the React client and Express server on Netlify using Netlify Functions. The setup mimics your local development environment where Vite serves the client and Express handles API routes.

## Architecture

- **Client**: React app built with Vite, deployed as static files
- **Server**: Express API wrapped in a Netlify Function
- **API Routes**: `/api/*` requests are redirected to `/.netlify/functions/api`

## Environment Variables

Set these in **Netlify Dashboard → Site Settings → Environment Variables**:

### Required:
- `MONGODB_URI` - Your MongoDB connection string
  - Example: `mongodb+srv://username:password@cluster.mongodb.net/evento?retryWrites=true&w=majority`

### Optional:
- `VITE_API_URL` - API base URL (defaults to `/api` if not set)
  - For same-domain setup: Leave empty or set to `/api`
  - For external API: Set to full URL like `https://api.example.com/api`
- `NODE_ENV` - Set to `production`
- `GEMINI_API_KEY` - For AI features (optional)

## How It Works

1. **Build Process**:
   - Builds the React client
   - Installs function dependencies
   - Installs server dependencies (needed by the function)

2. **Request Flow**:
   ```
   Browser → /api/events
   ↓
   Netlify Redirect → /.netlify/functions/api/events
   ↓
   Netlify Function → Express App → MongoDB
   ↓
   Response → JSON
   ```

3. **Static Files**:
   - Automatically served by Netlify
   - CSS, JS, images work without configuration

## Files Created

- `netlify/functions/api.ts` - Netlify Function wrapper for Express
- `netlify/functions/package.json` - Function dependencies
- `netlify.toml` - Netlify configuration

## Deployment

1. Connect your repository to Netlify
2. Netlify will auto-detect `netlify.toml`
3. Set environment variables in Netlify dashboard
4. Deploy!

## Troubleshooting

### API returns HTML instead of JSON
- Check that the redirect rule in `netlify.toml` is correct
- Verify `VITE_API_URL` is set to `/api` (or empty)

### MongoDB connection fails
- Verify `MONGODB_URI` is set correctly
- Check MongoDB Atlas network access allows Netlify IPs
- Ensure connection string includes authentication

### Function timeout
- Netlify Functions have a 10s timeout (free tier)
- Consider upgrading or optimizing database queries

### Build fails
- Check that all dependencies are installed
- Verify Node version is 20 (set in `netlify.toml`)

## Local Development

Local development works as before:
```bash
npm run dev
```

This runs Vite with Express middleware, same as before.

## Production Differences

- **Local**: Express runs as Vite middleware on port 3000
- **Netlify**: Express runs as a serverless function, accessed via redirect

The API URL (`/api`) works the same in both environments!

