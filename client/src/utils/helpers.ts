// Utility helper functions
import { INDIAN_CITIES } from './constants';

/**
 * Format price based on location
 * Uses ₹ for Indian cities, $ for others
 */
export const formatPrice = (price: number, city?: string): string => {
  if (price === 0) return 'Free';
  
  // Check if city is in India
  const isIndianCity = city && INDIAN_CITIES.some(indianCity => 
    city.toLowerCase().includes(indianCity.toLowerCase())
  );
  
  // Use appropriate currency symbol
  const currency = isIndianCity ? '₹' : '$';
  
  return `${currency}${price.toFixed(0)}`;
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
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Generate Google Maps navigation URL
 * @param coordinates - [lng, lat] format (as stored in database)
 * @param address - Fallback address string
 * @param city - City name for fallback
 * @param travelMode - Travel mode: 'driving', 'walking', 'transit', 'bicycling'
 * @returns Google Maps navigation URL
 */
export const getGoogleMapsNavigationUrl = (
  coordinates?: [number, number],
  address?: string,
  city?: string,
  travelMode: 'driving' | 'walking' | 'transit' | 'bicycling' = 'driving'
): string => {
  // If coordinates are available, use them (more accurate)
  if (coordinates && coordinates.length === 2) {
    // Coordinates are [lng, lat], Google Maps needs [lat, lng]
    const [lng, lat] = coordinates;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${travelMode}`;
  }
  
  // Fallback to address if coordinates not available
  const destination = encodeURIComponent(
    address && city ? `${address}, ${city}` : address || city || ''
  );
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=${travelMode}`;
};

/**
 * Generate Google Maps embed URL for mini map preview
 * Uses Google Maps iframe embed (no API key required for basic usage)
 * @param coordinates - [lng, lat] format (as stored in database)
 * @param address - Fallback address string
 * @param city - City name for fallback
 * @param zoom - Zoom level (default: 15)
 * @returns Google Maps embed iframe URL
 */
export const getGoogleMapsEmbedUrl = (
  coordinates?: [number, number],
  address?: string,
  city?: string,
  zoom: number = 15
): string => {
  // If coordinates are available, use them (more accurate)
  if (coordinates && coordinates.length === 2) {
    // Coordinates are [lng, lat], Google Maps needs [lat, lng]
    const [lng, lat] = coordinates;
    return `https://www.google.com/maps?q=${lat},${lng}&hl=en&z=${zoom}&output=embed`;
  }
  
  // Fallback to address if coordinates not available
  const query = encodeURIComponent(
    address && city ? `${address}, ${city}` : address || city || ''
  );
  return `https://www.google.com/maps?q=${query}&hl=en&z=${zoom}&output=embed`;
};
