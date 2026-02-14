// Use environment variable for production API URL, or default to relative path for dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ApiEvent {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  address: string;
  city: string;
  startDate: string;
  endDate: string;
  price: number;
  images: string[];
  organizerName: string;
  createdAt: string;
}

export interface NearbyEventsResponse {
  success: boolean;
  count: number;
  data: ApiEvent[];
}

export interface EventResponse {
  success: boolean;
  data: ApiEvent;
}

/**
 * Get events within 20km radius of given coordinates
 */
export const getNearbyEvents = async (
  lat: number,
  lng: number
): Promise<ApiEvent[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/events/nearby?lat=${lat}&lng=${lng}`
    );

    // Check if response is HTML (means we got redirected to index.html)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error(
        'API endpoint not found. Please configure VITE_API_URL environment variable to point to your backend server.'
      );
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: NearbyEventsResponse = await response.json();

    if (!result.success) {
      throw new Error('Failed to fetch events');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching nearby events:', error);
    // Re-throw with more context if it's a JSON parse error
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      throw new Error(
        'Backend API not configured. Please set VITE_API_URL environment variable in Netlify to your backend URL.'
      );
    }
    throw error;
  }
};

/**
 * Get event by ID
 */
export const getEventById = async (id: string): Promise<ApiEvent> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);

    // Check if response is HTML (means we got redirected to index.html)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error(
        'API endpoint not found. Please configure VITE_API_URL environment variable to point to your backend server.'
      );
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: EventResponse = await response.json();

    if (!result.success) {
      throw new Error('Failed to fetch event');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    // Re-throw with more context if it's a JSON parse error
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      throw new Error(
        'Backend API not configured. Please set VITE_API_URL environment variable in Netlify to your backend URL.'
      );
    }
    throw error;
  }
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format time to readable string
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Format price
 */
export const formatPrice = (price: number): string => {
  if (price === 0) return 'Free';
  return `$${price.toFixed(0)}`;
};

