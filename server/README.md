# Evento Backend Server

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/evento
PORT=3000
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Using MongoDB locally
mongod

# Or using Docker
docker run -d -p 27017:27017 mongo
```

### 4. Seed the Database

Run the seed script to populate the database with 20 sample events:

```bash
npm run seed
```

### 5. Start the Development Server

The dev server runs both Express API and Vite frontend on the same port:

```bash
npm run dev
```

The server will be available at:
- Frontend: http://localhost:3000
- API: http://localhost:3000/api

## API Endpoints

### GET /api/events/nearby
Get events within 20km radius of given coordinates.

**Query Parameters:**
- `lat` (required): Latitude (-90 to 90)
- `lng` (required): Longitude (-180 to 180)

**Example:**
```
GET /api/events/nearby?lat=12.9716&lng=77.5946
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "title": "Event Title",
      "description": "Event description",
      "category": "Music",
      "location": {
        "type": "Point",
        "coordinates": [77.5946, 12.9716]
      },
      "address": "Event Address",
      "city": "Bangalore",
      "startDate": "2024-01-15T18:00:00.000Z",
      "endDate": "2024-01-15T22:00:00.000Z",
      "price": 35,
      "images": ["https://..."],
      "organizerName": "Organizer Name",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /api/events/:id
Get event details by ID.

**Example:**
```
GET /api/events/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Event Title",
    ...
  }
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Evento API is running",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

## Project Structure

```
server/
├── db/
│   └── mongo.ts          # MongoDB connection
├── models/
│   └── Event.ts          # Event mongoose schema
├── controllers/
│   └── event.controller.ts  # Event business logic
├── routes/
│   └── event.routes.ts   # Event API routes
├── seed/
│   └── events.seed.ts    # Database seeding script
├── dev-server.ts         # Development server (Express + Vite)
└── index.ts              # Express app (standalone)
```

## Features

- ✅ MongoDB connection with Mongoose
- ✅ Event schema with geospatial indexing (2dsphere)
- ✅ Nearby events API with 20km radius
- ✅ Events sorted by distance (nearest first)
- ✅ Seed script with 20 sample events
- ✅ TypeScript types throughout
- ✅ Error handling
- ✅ Production-ready code structure

## Notes

- Events are stored with GeoJSON Point coordinates [longitude, latitude]
- The 2dsphere index enables efficient geospatial queries
- All events are sorted by distance automatically using MongoDB's $near operator
- The seed script generates events in multiple cities (Kochi, Bangalore, Mumbai, Delhi, Dubai)

