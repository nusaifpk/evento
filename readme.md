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

### ✅ Implemented (Frontend MVP - UI/UX)

**Navigation & Routing:**
- ✅ Splash screen with logo animation
- ✅ Interests selection screen (onboarding flow)
- ✅ Bottom navigation component
- ✅ React Router setup with all routes

**Core Screens:**
- ✅ **Home Screen** - Featured events carousel, "Happening Now" section, "Trending this weekend" cards
- ✅ **Map Screen** - UI mockup with event pins and floating event card (decorative map, not functional)
- ✅ **Event Details Screen** - Full event page with hero image, host info, date/time, location, description, ticket booking button
- ✅ **Search Screen** - Filter UI with date selection, vibe categories, distance radius slider
- ✅ **Saved Events Screen** - Bookmarked events list with reminder toggles
- ✅ **Profile Screen** - User profile with stats, interests, saved events, preferences

**Tech Stack:**
- ✅ React 19 + TypeScript
- ✅ Vite build tool
- ✅ React Router DOM v7
- ✅ Tailwind CSS (custom dark theme with primary color #f425f4)
- ✅ Lucide React icons
- ✅ Type definitions for Event and Interest interfaces

**Assets:**
- ✅ Logo assets (logoicon.png, logoboth.png, logotext.png)

### ⚠️ Partially Implemented

- ⚠️ **GEMINI_API_KEY** - Configured in `vite.config.ts` but not yet used (prepared for AI recommendations feature)
- ⚠️ **Event Data** - Using hardcoded mock data (no backend/database integration)
- ⚠️ **Map Integration** - UI only, no real Google Maps/Mapbox integration

### ❌ Not Yet Implemented

**Backend & Data:**
- ❌ Backend API (Node.js/Express)
- ❌ Database (MongoDB/PostgreSQL)
- ❌ Real event data source
- ❌ User authentication
- ❌ Data persistence (saved events, preferences)

**Core Features:**
- ❌ Location detection (geolocation API)
- ❌ Real map integration (Google Maps/Mapbox)
- ❌ Search functionality (currently UI only)
- ❌ Filter functionality (date, distance, category)
- ❌ Save/bookmark persistence
- ❌ Event reminders/notifications
- ❌ Ticket booking integration
- ❌ Navigation to event location

**Advanced Features:**
- ❌ AI recommendations (Gemini API integration)
- ❌ Organizer dashboard
- ❌ Social features (friends, invites)
- ❌ Real-time event updates
- ❌ Location-based search ("events in Bangalore")

**Next Priority Steps:**
1. Set up backend API and database
2. Integrate real map service (Google Maps/Mapbox)
3. Implement location detection
4. Connect search and filter functionality
5. Add data persistence for saved events
6. Implement AI recommendations using GEMINI_API_KEY

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
- Detect user location
- Show nearby events with:
  - Distance (KM)
  - Date & time
  - Category
  - Price / Free
- Map view (Google Maps)

### 🗺️ Map navigation
- Open route in Google Maps
- Live navigation

### 🔎 Smart filters
- Today / Tomorrow / Weekend
- Distance radius (5km, 10km, 50km)
- Categories:
  - Concerts
  - Parties
  - Workshops
  - Sports
  - Cultural
  - Food festivals

### ❤️ Save & reminders
- Bookmark events
- Notify before event starts

### 📅 Event details page
- Poster image
- Location
- Description
- Organizer info
- Ticket link
- Countdown timer

---

## 🔥 Advanced Features (Phase 2)

### 🤖 AI recommendations
Based on:
- Past events attended
- Interests
- Location behavior

Example:
> “You may like this techno party near you tonight.”

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
- Search “events in Bangalore”
- Search “events in Dubai next week”

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
- Events near you today
- Trending this weekend
- Happening now

### Map-first UI
Uber-like experience:
- Event pins
- Distance indicators
- Live updates

### Swipe discovery
Tinder-style:
- Like event
- Skip event

---

## 🏗️ Tech Stack

### Frontend (Current)
- ✅ **React 19** with TypeScript
- ✅ **Vite** (build tool & dev server)
- ✅ **React Router DOM v7** (routing)
- ✅ **Tailwind CSS** (styling with custom dark theme)
- ✅ **Lucide React** (icons)
- ⚠️ **Google Maps API** (configured but not integrated)
- ⚠️ **Gemini API** (API key configured, not yet used)

### Frontend (Planned)
- 🔲 Mapbox / Google Maps integration
- 🔲 State management (Redux / Zustand)
- 🔲 Form handling library

### Backend (To Be Implemented)
- 🔲 Node.js + Express
- 🔲 MongoDB (events database)
- 🔲 Redis (trending & caching)
- 🔲 User authentication (JWT/OAuth)

### APIs (To Be Integrated)
- 🔲 Google Maps API (for map view & navigation)
- 🔲 Places API (for venue information)
- 🔲 Geolocation API (for user location)
- 🔲 Gemini API (for AI recommendations)
- 🔲 Weather API (for outdoor events)
- 🔲 Ticketing APIs (future)

### Mobile (Future)
- 🔲 React Native
- 🔲 Flutter

---

## 🧩 Event Data Strategy

### Option 1: Organizer dashboard
Organizers upload events manually.

### Option 2: Scraping + APIs
- BookMyShow
- Meetup
- Eventbrite

### Option 3: Community contribution
Users submit events.

Best approach: Combination of all three.

---

## 🏆 Unique Ideas

### 🎧 Tonight Mode
Shows events happening within the next 5 hours.

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

- Fake events
- Lack of events in small towns
- Organizer verification
- Real-time updates
- User trust

---

## 📈 MVP Launch Plan

### Step 1: Frontend UI/UX ✅ **COMPLETED**
- ✅ Event listing screens (Home, Search, Saved)
- ✅ Event details page
- ✅ Map screen UI
- ✅ Navigation & routing
- ✅ User onboarding (Interests selection)
- ✅ Profile screen

### Step 2: Backend & Data Integration 🔲 **IN PROGRESS**
- 🔲 Backend API setup
- 🔲 Database schema & integration
- 🔲 Real event data source
- 🔲 Location detection
- 🔲 Map integration (Google Maps/Mapbox)

### Step 3: Core Functionality 🔲 **PENDING**
- 🔲 Search functionality
- 🔲 Filter implementation
- 🔲 Save/bookmark persistence
- 🔲 User authentication

### Step 4: Organizer Features 🔲 **PENDING**
- 🔲 Organizer upload panel
- 🔲 Event management dashboard

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
- Know what’s happening around you
- Never miss the moment
- Your city. Your events.
- Find the vibe near you

---

## 🧠 Startup Potential

### Strengths
- Daily-use product
- Local discovery
- Monetizable
- Globally scalable

### Risks
- No event database
- Poor UX

Execution matters more than the idea.

---

## 🔜 Next Steps

### Immediate (Phase 1)
1. ✅ **Frontend UI/UX** - COMPLETED
2. 🔲 **Backend Setup** - Set up Node.js/Express API
3. 🔲 **Database** - Create MongoDB schema for events, users, saved events
4. 🔲 **Map Integration** - Integrate Google Maps/Mapbox API
5. 🔲 **Location Services** - Implement geolocation detection

### Short-term (Phase 2)
6. 🔲 **Search & Filters** - Connect UI to backend API
7. 🔲 **Data Persistence** - Save user preferences and bookmarked events
8. 🔲 **Authentication** - User login/signup system
9. 🔲 **Real Event Data** - Connect to event data sources (scraping/APIs)

### Medium-term (Phase 3)
10. 🔲 **Organizer Dashboard** - Panel for event creators
11. 🔲 **Notifications** - Event reminders and alerts
12. 🔲 **AI Recommendations** - Integrate Gemini API for personalized suggestions
13. 🔲 **Ticket Integration** - Booking flow and payment

### Long-term (Phase 4)
14. 🔲 **Beta Launch** - Test in one city (Kochi/Bangalore)
15. 🔲 **Mobile App** - React Native/Flutter development
16. 🔲 **Social Features** - Friends, invites, group attendance
