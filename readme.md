# 🚀 Evento

Evento is a location-based event discovery platform that helps users find events happening around them based on location, time, and interests — with navigation and booking support.

---

## 🌟 Core Idea

A platform that shows events happening around a user based on location, time, and interests.

### Think:
- "What's happening near me tonight?"
- "Any concerts this weekend?"
- "Events in Kochi / Bangalore / Dubai next month?"

---

## 📊 Current Status

### ✅ Implemented (Full-Stack MVP)

**Backend & Database:**
- ✅ **Node.js/Express API** - RESTful API with all CRUD operations
- ✅ **MongoDB Database** - Mongoose ODM with event schemas
- ✅ **Real Event Data** - Seeded database with sample events
- ✅ **Environment Configuration** - Production-ready setup
- ✅ **API Documentation** - Clear endpoint structure

**Frontend & UI:**
- ✅ **React 19 + TypeScript** - Modern frontend with type safety
- ✅ **Vite Build Tool** - Fast development and optimized builds
- ✅ **React Router DOM v7** - Complete routing system
- ✅ **Tailwind CSS** - Custom dark theme with primary #f425f4
- ✅ **Lucide React Icons** - Consistent icon system
- ✅ **Responsive Design** - Mobile-first approach

**Core Features:**
- ✅ **Location Detection** - Auto-requests GPS permission on app open
- ✅ **Real Map Integration** - Interactive Leaflet maps with event pins
- ✅ **GPS Live Location** - Blue indicator with pulsing animation
- ✅ **Search Functionality** - Full-text search across event data
- ✅ **Smart Filters** - Date, vibe categories, distance radius
- ✅ **Distance Calculations** - Accurate KM from user location
- ✅ **Reverse Geocoding** - Location name display using OpenStreetMap

**Navigation & Routing:**
- ✅ **Splash Screen** - Logo animation and onboarding
- ✅ **Interests Selection** - User preference setup
- ✅ **Bottom Navigation** - Seamless screen transitions
- ✅ **All Core Screens** - Home, Map, Search, Profile, Event Details

**Map Features:**
- ✅ **Interactive Maps** - Clickable event markers with details
- ✅ **GPS Centering** - Map centers on user location
- ✅ **Event Cards** - Bottom floating cards for event details
- ✅ **Google Maps Navigation** - Direct navigation to event venues
- ✅ **Distance Display** - Real-time distance calculations

**Data & Currency:**
- ✅ **Indian Rupee Support** - ₹ symbol for all prices
- ✅ **Data Persistence** - MongoDB with event storage
- ✅ **API Integration** - Full frontend-backend connectivity

### ⚠️ Partially Implemented

- ⚠️ **User Authentication** - JWT setup but not fully integrated
- ⚠️ **Event Saving** - UI ready, backend partially implemented
- ⚠️ **GEMINI_API_KEY** - Configured but not yet used (AI recommendations)

### ❌ Not Yet Implemented

**Advanced Features:**
- ❌ **AI Recommendations** - Gemini API integration for personalized suggestions
- ❌ **Social Features** - Friends, invites, group attendance
- ❌ **Real-time Updates** - Live event status changes
- ❌ **Push Notifications** - Event reminders and alerts
- ❌ **Ticket Booking** - Payment integration and QR passes
- ❌ **Organizer Dashboard** - Event management panel

**User Features:**
- ❌ **User Profiles** - Personal event history and preferences
- ❌ **Event Reviews** - Rating and review system
- ❌ **Event Sharing** - Social media integration
- ❌ **Offline Mode** - Cached event data

---

## 🎯 Target Users

### 1) Event Seekers
People looking for:
- Concerts
- Parties
- Beach events
- Tech meetups
- College fests
- Workshops

### 2) Event Organizers
- Clubs  
- DJ teams  
- Colleges  
- Companies  
- Influencers  
- Communities  

Organizers can list and manage events.

---

## ⭐ Core Features (MVP)

### 📍 Location-based discovery
- ✅ Detect user location automatically
- ✅ Show nearby events with:
  - Distance (KM)
  - Date & time
  - Category
  - Price / Free
- ✅ Interactive map view (Leaflet)

### 🗺️ Map navigation
- ✅ Open route in Google Maps
- ✅ Live GPS tracking
- ✅ Event markers with details

### 🔎 Smart filters
- ✅ Today / Tomorrow / Weekend / Week / Month
- ✅ Distance radius (5km to 50km with live slider)
- ✅ Categories:
  - Music
  - Arts
  - Nightlife
  - Tech
  - Food
  - Sports

### 📅 Event details page
- ✅ Poster image gallery
- ✅ Location with map integration
- ✅ Description and details
- ✅ Organizer information
- ✅ Countdown timer
- ✅ Navigation button

### 💰 Currency & Pricing
- ✅ Indian Rupee (₹) for all prices
- ✅ Free event indicators
- ✅ Price formatting

---

## 🔥 Advanced Features (Phase 2)

### 🤖 AI recommendations
Based on:
- Past events attended
- Interests
- Location behavior

Example:
> "You may like this techno party near you tonight."

### 🎟️ Ticket integration
- Book tickets inside the app
- QR pass entry

### 🧑‍🤝‍🧑 Social layer
- See who is attending
- Invite friends
- Group attendance

### 📡 Real-time events
- Happening now
- Live streaming
- Emergency alerts

### 🌍 Explore any location
- Search "events in Bangalore"
- Search "events in Dubai next week"

---

## 💰 Monetization Ideas

1. Sponsored events  
   - Promoters pay for top listing  

2. Ticket commission  
   - Percentage from bookings  

3. Organizer subscription  
   - Paid dashboard for event creators  

4. Ads  
   - Clubs  
   - Brands  
   - Tourism companies  

---

## 🧠 UX Ideas

### Home screen
- ✅ Events near you today
- ✅ Trending this weekend
- ✅ Happening now
- ✅ Location-based recommendations

### Map-first UI
Uber-like experience:
- ✅ Event pins
- ✅ Distance indicators
- ✅ Live location tracking
- ✅ Interactive map controls

### Swipe discovery
Tinder-style:
- 🔲 Like event
- 🔲 Skip event

---

## 🏗️ Tech Stack

### Frontend (Current)
- ✅ **React 19** with TypeScript
- ✅ **Vite** (build tool & dev server)
- ✅ **React Router DOM v7** (routing)
- ✅ **Tailwind CSS** (styling with custom dark theme)
- ✅ **Lucide React** (icons)
- ✅ **Leaflet** (interactive maps)
- ✅ **OpenStreetMap** (map tiles and geocoding)

### Backend (Current)
- ✅ **Node.js + Express** (API server)
- ✅ **MongoDB** (events database)
- ✅ **Mongoose** (ODM for MongoDB)
- ✅ **JWT** (authentication tokens)
- ✅ **dotenv** (environment management)

### APIs (Integrated)
- ✅ **Geolocation API** (user location detection)
- ✅ **OpenStreetMap Nominatim** (reverse geocoding)
- ✅ **Google Maps** (navigation integration)
- ⚠️ **Gemini API** (API key configured, not yet used)

### APIs (Planned)
- 🔲 Weather API (for outdoor events)
- 🔲 Ticketing APIs (future)
- 🔲 Payment gateways

### Mobile (Future)
- 🔲 React Native
- 🔲 Flutter

---

## 🧩 Event Data Strategy

### Current Implementation
- ✅ **MongoDB Database** - Structured event storage
- ✅ **Seed Data** - Sample events for testing
- ✅ **API Endpoints** - CRUD operations for events

### Future Options
1. **Organizer dashboard** - Manual event uploads
2. **Scraping + APIs** - BookMyShow, Meetup, Eventbrite
3. **Community contribution** - User-submitted events

Best approach: Combination of all three.

---

## 🏆 Unique Ideas

### 🎧 Tonight Mode
✅ Shows events happening within the next 5 hours.

### 🏖️ Mood-based search
- Party mood
- Chill mood
- Networking mood

### 🧭 Travel Mode
Shows events in a destination city.

### 🕺 Crowd heat map
Shows areas with the highest event activity.

---

## ⚠️ Challenges

- ✅ **Fake events** - Mitigated with database structure
- ⚠️ **Lack of events in small towns** - Needs more data sources
- ⚠️ **Organizer verification** - Needs authentication system
- ⚠️ **Real-time updates** - Needs WebSocket implementation
- ⚠️ **User trust** - Needs review system

---

## 📈 MVP Launch Plan

### Step 1: Frontend UI/UX ✅ **COMPLETED**
- ✅ Event listing screens (Home, Search, Saved)
- ✅ Event details page
- ✅ Map screen with real integration
- ✅ Navigation & routing
- ✅ User onboarding (Interests selection)
- ✅ Profile screen

### Step 2: Backend & Data Integration ✅ **COMPLETED**
- ✅ Backend API setup (Express + MongoDB)
- ✅ Database schema & integration
- ✅ Real event data (seeded database)
- ✅ Location detection (GPS + Geocoding)
- ✅ Map integration (Leaflet + OpenStreetMap)

### Step 3: Core Functionality ✅ **COMPLETED**
- ✅ Search functionality (full-text + filters)
- ✅ Filter implementation (date, distance, category)
- ✅ Save/bookmark UI (backend partially done)
- ⚠️ User authentication (JWT setup, needs integration)

### Step 4: Organizer Features 🔲 **IN PROGRESS**
- ⚠️ Organizer upload panel (UI ready)
- 🔲 Event management dashboard
- 🔲 Authentication integration

### Step 5: Notifications 🔲 **PENDING**
- 🔲 Event reminders
- 🔲 Push notifications

### Step 6: Ticket Integration 🔲 **PENDING**
- 🔲 Ticket booking flow
- 🔲 Payment integration

### Step 7: AI Recommendations 🔲 **PENDING**
- 🔲 Gemini API integration
- 🔲 Personalized event suggestions

---

## 💡 Branding

**Name:** Evento  

### Taglines:
- Know what's happening around you
- Never miss the moment
- Your city. Your events.
- Find the vibe near you

---

## 🧠 Startup Potential

### Strengths
- ✅ Daily-use product
- ✅ Local discovery
- ✅ Monetizable
- ✅ Globally scalable
- ✅ Working MVP with real tech stack

### Risks
- ⚠️ Event data acquisition
- ⚠️ User adoption challenges
- ⚠️ Competition from established platforms

Execution matters more than the idea.

---

## 🔜 Next Steps

### Immediate (Phase 1) ✅ **COMPLETED**
1. ✅ **Frontend UI/UX** - COMPLETED
2. ✅ **Backend Setup** - COMPLETED
3. ✅ **Database** - COMPLETED
4. ✅ **Map Integration** - COMPLETED
5. ✅ **Location Services** - COMPLETED

### Short-term (Phase 2) 🔲 **IN PROGRESS**
6. ✅ **Search & Filters** - COMPLETED
7. ⚠️ **Data Persistence** - Mostly COMPLETED
8. ⚠️ **Authentication** - JWT setup, needs frontend integration
9. ✅ **Real Event Data** - COMPLETED (seeded database)

### Medium-term (Phase 3) 🔲 **PENDING**
10. 🔲 **Organizer Dashboard** - Panel for event creators
11. 🔲 **Notifications** - Event reminders and alerts
12. 🔲 **AI Recommendations** - Integrate Gemini API for personalized suggestions
13. 🔲 **Ticket Integration** - Booking flow and payment

### Long-term (Phase 4) 🔲 **PENDING**
14. 🔲 **Beta Launch** - Test in one city (Kochi/Bangalore)
15. 🔲 **Mobile App** - React Native/Flutter development
16. 🔲 **Social Features** - Friends, invites, group attendance

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd evento

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and other configs

# Start development servers
npm run dev
```

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/evento
JWT_SECRET=your-jwt-secret
GEMINI_API_KEY=your-gemini-api-key
PORT=3000
```

The app will be available at `http://localhost:3000` with the frontend and backend running together.
