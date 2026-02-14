# 🎉 Evento - Restructured Monorepo

## 📁 New Project Structure

```
evento/
├── 📁 client/                         # React Frontend (Vite)
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   │
│   └── 📁 src/
│       ├── main.tsx
│       ├── App.tsx
│       │
│       ├── 📁 types/
│       │   ├── event.types.ts
│       │   └── user.types.ts
│       │
│       ├── 📁 components/
│       │   └── BottomNav.tsx
│       │
│       ├── 📁 screens/
│       │   ├── SplashScreen.tsx
│       │   ├── HomeScreen.tsx
│       │   ├── MapScreen.tsx
│       │   ├── SearchScreen.tsx
│       │   ├── SavedScreen.tsx
│       │   ├── ProfileScreen.tsx
│       │   ├── InterestsScreen.tsx
│       │   └── EventDetailsScreen.tsx
│       │
│       ├── 📁 services/
│       │   ├── api.ts
│       │   └── event.service.ts
│       │
│       ├── 📁 hooks/
│       │   └── useEvents.ts
│       │
│       ├── 📁 utils/
│       │   ├── constants.ts
│       │   └── helpers.ts
│       │
│       └── 📁 assets/
│           ├── logoicon.png
│           ├── logoboth.png
│           └── logotext.png
│
├── 📁 server/                         # Express Backend
│   ├── package.json
│   │
│   └── 📁 src/
│       ├── app.ts                     # Express configuration
│       ├── server.ts                  # Vite middleware + app.listen
│       │
│       ├── 📁 config/
│       │   ├── env.ts
│       │   └── mongo.ts
│       │
│       ├── 📁 modules/                # Modular feature-based structure
│       │
│       │   ├── 📁 event/
│       │   │   ├── event.model.ts
│       │   │   ├── event.controller.ts
│       │   │   ├── event.routes.ts
│       │   │   └── event.service.ts
│       │   │
│       │   ├── 📁 admin/               # Future
│       │   │   ├── admin.model.ts
│       │   │   ├── admin.controller.ts
│       │   │   ├── admin.routes.ts
│       │   │   └── admin.service.ts
│       │   │
│       │   └── 📁 user/               # Future
│       │
│       ├── 📁 middleware/
│       │   ├── auth.middleware.ts
│       │   └── error.middleware.ts
│       │
│       ├── 📁 utils/
│       │   ├── asyncHandler.ts
│       │   └── AppError.ts
│       │
│       └── 📁 seed/
│           └── events.seed.ts
│
├── 📄 .env
├── 📄 .gitignore
├── 📄 package.json                    # Root scripts
└── 📄 README.md
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Environment Setup
Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/evento
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
```

### 3. Start Development
```bash
# Start both client and server
npm run dev

# Or start individually
npm run server  # Backend only
npm run client  # Frontend only
```

### 4. Seed Database
```bash
npm run seed
```

## 📦 Available Scripts

- `npm run dev` - Start both client and server
- `npm run server` - Start backend server only
- `npm run client` - Start frontend dev server only
- `npm run build` - Build for production
- `npm run seed` - Seed database with sample events
- `npm run install:all` - Install all dependencies

## 🚀 Deployment (Netlify)

The project is configured for Netlify deployment:

1. **Client Deployment**: 
   - Build command: `cd client && npm install && npm run build`
   - Publish directory: `client/dist`
   - Configuration: `client/netlify.toml`

2. **Environment Variables** (set in Netlify dashboard):
   - `VITE_API_URL` - Your API endpoint URL
   - `MONGODB_URI` - MongoDB connection string (if using serverless functions)

3. **Deploy**:
   - Connect your repository to Netlify
   - Netlify will automatically detect the `netlify.toml` configuration
   - Set environment variables in Netlify dashboard
   - Deploy!

## 🏗️ Architecture Benefits

### ✅ **Modular Structure**
- Feature-based organization
- Clear separation of concerns
- Scalable codebase

### ✅ **Better Developer Experience**
- Custom hooks for data fetching
- Utility functions for common operations
- Type-safe TypeScript throughout

### ✅ **Professional Setup**
- Error handling middleware
- Authentication middleware
- Configuration management
- Async handlers

### ✅ **Maintainable Code**
- Constants in one place
- Helper functions reusable
- Service layer for API calls
- Type definitions organized

## 🎯 Key Features

- 🗺️ Location-based event discovery
- 💱 Currency formatting by location (₹/$)
- 📱 Mobile-responsive design
- 🔄 Real-time data fetching
- 🎯 Geospatial event filtering
- 🔐 Authentication ready
- 🛡️ Error handling
- 📊 Modular architecture

## 🛠️ Tech Stack

**Frontend:**
- ⚛️ React 18 + TypeScript
- 🎨 Tailwind CSS
- 🧭 React Router (BrowserRouter)
- 💫 Lucide React Icons
- ⚡ Vite (Build Tool)

**Backend:**
- 🟢 Node.js + Express
- 🗄️ MongoDB + Mongoose
- 🌐 Geospatial Queries
- 📍 Location-based Services
- 🔐 JWT Authentication
- 🛡️ Error Handling

## 📝 Migration Notes

The project has been restructured from a flat file organization to a professional monorepo structure:

- **Before**: All files in root directories
- **After**: Organized client/server separation with modular architecture

All functionality remains the same, but the codebase is now more maintainable and scalable!
