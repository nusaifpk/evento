import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../db/mongo.js';
import { Event } from '../models/Event.js';

dotenv.config();

// Sample cities with coordinates [lng, lat]
const cities = [
  { name: 'Kochi', coords: [76.2673, 9.9312] },
  { name: 'Bangalore', coords: [77.5946, 12.9716] },
  { name: 'Mumbai', coords: [72.8777, 19.0760] },
  { name: 'Delhi', coords: [77.2090, 28.6139] },
  { name: 'Dubai', coords: [55.2708, 25.2048] },
];

const categories = [
  'Music',
  'Nightlife',
  'Tech',
  'Arts',
  'Food',
  'Sports',
  'Gaming',
  'Outdoors',
  'Workshop',
  'Cultural',
];

const sampleEvents = [
  {
    title: 'Neon Nights: Underground Techno',
    description: 'Experience the loudest bass in the city. Featuring top DJs, immersive light shows, and top-tier sound systems. The underground scene comes to the surface.',
    category: 'Music',
    address: 'The Warehouse, District 9, Industrial Zone',
    price: 35,
    organizerName: 'Bass Collective',
    images: ['https://images.unsplash.com/photo-1570158268183-d296b2892211?q=80&w=1000&auto=format&fit=crop'],
  },
  {
    title: 'Electric Rooftop Party',
    description: 'Skyline views meet electronic beats. Join us for an unforgettable night under the stars with premium cocktails and world-class DJs.',
    category: 'Nightlife',
    address: 'Skyline Lounge, Rooftop Level',
    price: 40,
    organizerName: 'Skyline Events',
    images: ['https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=1000&auto=format&fit=crop'],
  },
  {
    title: 'Jazz & Cocktails Evening',
    description: 'Smooth jazz melodies paired with handcrafted cocktails. An intimate evening of music and conversation.',
    category: 'Music',
    address: 'The Blue Note, Downtown',
    price: 25,
    organizerName: 'Jazz Society',
    images: ['https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=200&auto=format&fit=crop'],
  },
  {
    title: 'Pottery Workshop',
    description: 'Learn the art of pottery in a relaxed, creative environment. All materials provided. Perfect for beginners.',
    category: 'Workshop',
    address: 'Studio 4B, Arts District',
    price: 50,
    organizerName: 'Creative Studio',
    images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=200&auto=format&fit=crop'],
  },
  {
    title: 'Summer Vibes Festival',
    description: 'Central Park open air festival featuring multiple stages, food trucks, and activities for all ages.',
    category: 'Music',
    address: 'Central Park, Main Stage',
    price: 45,
    organizerName: 'Festival Organizers',
    images: ['https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=500&auto=format&fit=crop'],
  },
  {
    title: 'Tech Networking Meetup',
    description: 'Connect with fellow developers, entrepreneurs, and tech enthusiasts. Lightning talks and networking session.',
    category: 'Tech',
    address: 'Innovation Hub, Tech Park',
    price: 0,
    organizerName: 'Tech Community',
    images: ['https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=500&auto=format&fit=crop'],
  },
  {
    title: 'Food Festival: Street Eats',
    description: 'Taste the best street food from around the world. Live cooking demonstrations and food competitions.',
    category: 'Food',
    address: 'Food Court, City Center',
    price: 15,
    organizerName: 'Foodie Events',
    images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop'],
  },
  {
    title: 'Beach Volleyball Tournament',
    description: 'Competitive beach volleyball tournament. Teams welcome. Prizes for winners.',
    category: 'Sports',
    address: 'Beach Sports Complex',
    price: 20,
    organizerName: 'Sports Club',
    images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop'],
  },
  {
    title: 'Gaming LAN Party',
    description: '24-hour gaming marathon. Bring your PC or console. Tournaments, prizes, and snacks included.',
    category: 'Gaming',
    address: 'Gaming Arena, Entertainment Zone',
    price: 30,
    organizerName: 'Gaming Community',
    images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop'],
  },
  {
    title: 'Art Gallery Opening',
    description: 'Exclusive opening of contemporary art exhibition. Meet the artists and enjoy wine and cheese.',
    category: 'Arts',
    address: 'Modern Art Gallery, Cultural District',
    price: 0,
    organizerName: 'Art Gallery',
    images: ['https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400&auto=format&fit=crop'],
  },
  {
    title: 'Hiking Adventure: Mountain Trail',
    description: 'Guided hiking tour through scenic mountain trails. Suitable for all fitness levels. Equipment provided.',
    category: 'Outdoors',
    address: 'Mountain Base Camp',
    price: 25,
    organizerName: 'Adventure Club',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop'],
  },
  {
    title: 'Cultural Dance Performance',
    description: 'Traditional dance performances from different regions. Experience rich cultural heritage.',
    category: 'Cultural',
    address: 'Cultural Center, Main Hall',
    price: 20,
    organizerName: 'Cultural Society',
    images: ['https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1000&auto=format&fit=crop'],
  },
  {
    title: 'Indie Rock Concert',
    description: 'Live performance by popular indie rock bands. High energy show with great sound quality.',
    category: 'Music',
    address: 'Concert Hall, Music District',
    price: 55,
    organizerName: 'Music Promoters',
    images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000&auto=format&fit=crop'],
  },
  {
    title: 'Cocktail Mixing Masterclass',
    description: 'Learn to mix professional cocktails from expert bartenders. Includes tasting session.',
    category: 'Workshop',
    address: 'Mixology Bar, Downtown',
    price: 60,
    organizerName: 'Bar Academy',
    images: ['https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=1000&auto=format&fit=crop'],
  },
  {
    title: 'Yoga & Meditation Retreat',
    description: 'Peaceful morning yoga session followed by meditation. All levels welcome. Mats provided.',
    category: 'Outdoors',
    address: 'Park Pavilion, Green Space',
    price: 15,
    organizerName: 'Wellness Center',
    images: ['https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop'],
  },
  {
    title: 'Comedy Night: Stand-up Special',
    description: 'Laugh your heart out with top comedians. Intimate venue, great atmosphere.',
    category: 'Cultural',
    address: 'Comedy Club, Entertainment District',
    price: 30,
    organizerName: 'Comedy Collective',
    images: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop'],
  },
  {
    title: 'Hackathon: 48-Hour Challenge',
    description: 'Build something amazing in 48 hours. Prizes, mentorship, and networking opportunities.',
    category: 'Tech',
    address: 'Tech Hub, Innovation Center',
    price: 0,
    organizerName: 'Developer Community',
    images: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop'],
  },
  {
    title: 'Wine Tasting Experience',
    description: 'Sample premium wines from around the world. Expert sommelier guidance included.',
    category: 'Food',
    address: 'Wine Cellar, Fine Dining District',
    price: 75,
    organizerName: 'Wine Society',
    images: ['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop'],
  },
  {
    title: 'Basketball Tournament',
    description: '3v3 street basketball tournament. Cash prizes for winners. Registration required.',
    category: 'Sports',
    address: 'Sports Complex, Court 3',
    price: 25,
    organizerName: 'Basketball League',
    images: ['https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=1000&auto=format&fit=crop'],
  },
  {
    title: 'Photography Walk & Workshop',
    description: 'Explore the city through your lens. Professional photographer guidance and tips.',
    category: 'Workshop',
    address: 'City Center, Starting Point',
    price: 40,
    organizerName: 'Photography Club',
    images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1000&auto=format&fit=crop'],
  },
];

const generateRandomDate = (daysFromNow: number = 0): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(Math.floor(Math.random() * 12) + 18, 0, 0, 0); // Evening events
  return date;
};

const generateEndDate = (startDate: Date): Date => {
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + Math.floor(Math.random() * 4) + 2); // 2-6 hours duration
  return endDate;
};

const seedEvents = async (): Promise<void> => {
  try {
    await connectDB();

    // Clear existing events
    await Event.deleteMany({});
    console.log('🗑️  Cleared existing events');

    // Generate 20 events
    const eventsToInsert = [];

    for (let i = 0; i < 20; i++) {
      const city = cities[i % cities.length];
      const baseEvent = sampleEvents[i % sampleEvents.length];
      
      // Add slight variation to coordinates (within ~5km)
      const latOffset = (Math.random() - 0.5) * 0.05; // ~5km
      const lngOffset = (Math.random() - 0.5) * 0.05;
      
      const startDate = generateRandomDate(Math.floor(Math.random() * 30)); // Within next 30 days
      const endDate = generateEndDate(startDate);

      eventsToInsert.push({
        ...baseEvent,
        location: {
          type: 'Point',
          coordinates: [city.coords[0] + lngOffset, city.coords[1] + latOffset],
        },
        city: city.name,
        startDate,
        endDate,
        createdAt: new Date(),
      });
    }

    const insertedEvents = await Event.insertMany(eventsToInsert);
    console.log(`✅ Seeded ${insertedEvents.length} events successfully`);

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    await disconnectDB();
    process.exit(1);
  }
};

seedEvents();

