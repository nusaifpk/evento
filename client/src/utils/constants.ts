// Application constants
export const APP_CONFIG = {
  name: 'Evento',
  version: '1.0.0',
  description: 'Discover events near you'
};

// Default location (Bangalore)
export const DEFAULT_LOCATION = {
  lat: 12.9716,
  lng: 77.5946,
  city: 'Bangalore'
};

// API endpoints
export const API_ENDPOINTS = {
  events: {
    nearby: '/api/events/nearby',
    byId: '/api/events/:id',
    search: '/api/events/search'
  },
  health: '/api/health'
} as const;

// Event categories
export const EVENT_CATEGORIES = [
  'Music',
  'Nightlife', 
  'Tech',
  'Arts',
  'Food',
  'Sports',
  'Gaming',
  'Outdoors',
  'Workshop',
  'Cultural'
] as const;

// Indian cities for currency formatting
export const INDIAN_CITIES = [
  'Kochi', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata',
  'Hyderabad', 'Pune', 'Jaipur', 'Lucknow', 'Ahmedabad', 'Chandigarh',
  'Indore', 'Nagpur', 'Bhopal', 'Visakhapatnam', 'Coimbatore', 'Kochi',
  'Thiruvananthapuram', 'Guwahati', 'Bhubaneswar', 'Amritsar', 'Nashik',
  'Vijayawada', 'Madurai', 'Raipur', 'Ranchi', 'Gwalior', 'Jabalpur',
  'Jodhpur', 'Aurangabad', 'Guntur', 'Tirupati', 'Mysore', 'Mangalore',
  'Trivandrum', 'Varanasi', 'Patna', 'Srinagar', 'Agra', 'Noida',
  'Gurgaon', 'Faridabad', 'Ghaziabad', 'Meerut', 'Rajkot', 'Kota',
  'Chandigarh', 'Ludhiana', 'Cochin', 'Bareilly', 'Aligarh', 'Moradabad',
  'Jalandhar', 'Firozabad', 'Kochi', 'Bhilai', 'Amravati', 'Allahabad',
  'Ranchi', 'Gulbarga', 'Jamshedpur', 'Bhavnagar', 'Davanagere', 'Kolar',
  'Kozhikode', 'Akola', 'Bellary', 'Rajahmundry', 'Tumkur', 'Khammam'
] as const;
