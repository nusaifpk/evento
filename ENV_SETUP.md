# 🔐 Environment Variables Setup Guide

This document explains all the environment variables needed for the Evento project.

## 📋 Required Environment Variables

### 1. **MONGODB_URI** (Required)
- **Description**: MongoDB database connection string
- **Required**: ✅ Yes
- **Example**: 
  - Local: `mongodb://localhost:27017/evento`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/evento?retryWrites=true&w=majority`
- **Where to get**: 
  - Local MongoDB: Install MongoDB locally
  - MongoDB Atlas: Sign up at https://www.mongodb.com/cloud/atlas

### 2. **NODE_ENV** (Required)
- **Description**: Node.js environment mode
- **Required**: ✅ Yes
- **Values**: `development` | `production`
- **Default**: `development`

### 3. **VITE_API_URL** (Required for Frontend)
- **Description**: Base URL for API requests from frontend
- **Required**: ✅ Yes (for production)
- **Examples**:
  - Development: `http://localhost:3000/api`
  - Production: `https://your-api-domain.com/api`
  - Netlify: `/api` (if using serverless functions)

## 🔧 Optional Environment Variables

### 4. **PORT** (Optional)
- **Description**: Server port number
- **Required**: ❌ No
- **Default**: `3000`
- **Example**: `3000`

### 5. **JWT_SECRET** (Optional - For Future Auth)
- **Description**: Secret key for JWT token signing
- **Required**: ❌ No (not yet implemented)
- **How to generate**: 
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Example**: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

### 6. **JWT_EXPIRE** (Optional - For Future Auth)
- **Description**: JWT token expiration time
- **Required**: ❌ No (not yet implemented)
- **Examples**: `30d`, `7d`, `24h`, `1h`
- **Default**: `30d`

### 7. **GEMINI_API_KEY** (Optional)
- **Description**: Google Gemini API key for AI recommendations
- **Required**: ❌ No (optional feature)
- **Where to get**: https://makersuite.google.com/app/apikey
- **Example**: `AIzaSy...`

## 🚀 Setup Instructions

### Local Development

1. **Create `.env` file** in the project root:
   ```bash
   cp .env.example .env
   ```

2. **Fill in required values**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/evento
   NODE_ENV=development
   VITE_API_URL=http://localhost:3000/api
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

### Netlify Deployment

1. **Go to Netlify Dashboard** → Your Site → Site Settings → Environment Variables

2. **Add these variables**:
   - `MONGODB_URI` - Your MongoDB connection string
   - `VITE_API_URL` - Your API endpoint (e.g., `https://your-api.netlify.app/api` or external API URL)
   - `NODE_ENV` - Set to `production`
   - `GEMINI_API_KEY` - (Optional) If using AI features

3. **For Serverless Functions** (if using Netlify Functions):
   - Add `MONGODB_URI` to function environment variables
   - Functions can access these via `process.env.MONGODB_URI`

## 📝 Notes

- **Never commit `.env` file** to version control
- `.env.example` is a template - copy it to `.env` and fill in your values
- For production, use strong, unique values for secrets
- MongoDB Atlas provides a free tier perfect for development
- Vite requires `VITE_` prefix for frontend environment variables

## 🔍 Variable Usage

| Variable | Used In | Required |
|----------|---------|----------|
| `MONGODB_URI` | `server/src/config/mongo.ts` | ✅ Yes |
| `NODE_ENV` | `server/src/app.ts`, `server/src/config/mongo.ts` | ✅ Yes |
| `VITE_API_URL` | Frontend API calls | ✅ Yes (production) |
| `PORT` | Server startup | ❌ No (defaults to 3000) |
| `JWT_SECRET` | Future auth implementation | ❌ No (not yet used) |
| `JWT_EXPIRE` | Future auth implementation | ❌ No (not yet used) |
| `GEMINI_API_KEY` | `client/vite.config.ts` | ❌ No (optional) |

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Verify `MONGODB_URI` is correct
- Check MongoDB is running (if local)
- Verify network access (if Atlas)
- Check firewall settings

### API Not Working
- Verify `VITE_API_URL` is correct
- Check CORS settings on backend
- Ensure API server is running

### Environment Variables Not Loading
- Ensure `.env` file is in project root
- Restart development server after changing `.env`
- Check for typos in variable names

