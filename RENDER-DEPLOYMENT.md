# 🚀 Render Deployment - Build & Start Commands

## Commands Overview

### Build Command
```bash
npm run install:all && npm run build:all && npm run build:server
```

**What it does:**
1. `npm run install:all` - Installs dependencies for:
   - Root directory (`npm install`)
   - Client directory (`cd client && npm install`)
   - Server directory (`cd server && npm install`)

2. `npm run build:all` - Builds the React client:
   - Runs `cd client && npm run build`
   - Output: `client/dist/` folder with production React app

3. `npm run build:server` - Compiles TypeScript server:
   - Runs `cd server && npm run build` (which runs `tsc`)
   - Output: `server/dist/` folder with compiled JavaScript

### Start Command
```bash
npm run start:prod
```

**What it does:**
- Runs `node server/dist/server.prod.js`
- Starts the Express server that:
  - Serves static files from `client/dist/`
  - Handles API routes at `/api/*`
  - Connects to MongoDB
  - Provides SPA fallback for React Router

## Detailed Breakdown

### 1. Install All Dependencies
```bash
npm run install:all
```
This script (from root `package.json`):
```json
"install:all": "npm install && cd client && npm install && cd ../server && npm install"
```

### 2. Build Client
```bash
npm run build:all
```
This script (from root `package.json`):
```json
"build:all": "cd client && npm run build"
```
Which runs (from `client/package.json`):
```json
"build": "tsc && vite build"
```
**Output:** `client/dist/` - Production-ready React app

### 3. Build Server
```bash
npm run build:server
```
This script (from root `package.json`):
```json
"build:server": "cd server && npm run build && cd .."
```
Which runs (from `server/package.json`):
```json
"build": "tsc"
```
**Output:** `server/dist/` - Compiled JavaScript files

### 4. Start Production Server
```bash
npm run start:prod
```
This script (from root `package.json`):
```json
"start:prod": "node server/dist/server.prod.js"
```

## File Structure After Build

```
evento/
├── client/
│   └── dist/              ← Built React app (static files)
│       ├── index.html
│       ├── assets/
│       └── ...
├── server/
│   └── dist/              ← Compiled server code
│       ├── server.prod.js ← Production server entry point
│       ├── config/
│       ├── modules/
│       └── ...
└── render.yaml            ← Render configuration
```

## Render Configuration (render.yaml)

```yaml
services:
  - type: web
    name: evento
    env: node
    plan: free
    buildCommand: npm run install:all && npm run build:all && npm run build:server
    startCommand: npm run start:prod
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: PORT
        value: 10000
    healthCheckPath: /api/health
```

## Manual Testing (Local)

You can test the build process locally:

```bash
# 1. Install all dependencies
npm run install:all

# 2. Build client
npm run build:all

# 3. Build server
npm run build:server

# 4. Start production server
npm run start:prod
```

Then visit: `http://localhost:10000`

## Troubleshooting

### Build Fails
- Check that all `package.json` files have correct scripts
- Verify Node.js version (Render uses Node 18+)
- Check build logs for specific errors

### Start Command Fails
- Verify `server/dist/server.prod.js` exists after build
- Check that `MONGODB_URI` environment variable is set
- Verify file paths in `server.prod.ts` are correct

### Static Files Not Found
- Ensure `client/dist/` folder exists after build
- Check path in `server.prod.ts`: `path.resolve(__dirname, '../../../client/dist')`
- Verify the build completed successfully

## Alternative: Inline Commands

If you prefer to set commands directly in Render dashboard instead of using `render.yaml`:

**Build Command:**
```bash
npm install && cd client && npm install && cd ../server && npm install && cd ../client && npm run build && cd ../server && npm run build
```

**Start Command:**
```bash
node server/dist/server.prod.js
```

But using `render.yaml` with npm scripts is cleaner and easier to maintain!

