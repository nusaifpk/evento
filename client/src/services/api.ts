import { formatDate, formatTime, formatPrice, calculateDistance } from '../utils/helpers';
import type { ApiEvent } from '../types/event.types';

// Re-export ApiEvent for convenience
export type { ApiEvent };

// Use environment variable for API URL, fallback to /api for development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface NearbyEventsResponse {
  success: boolean;
  count: number;
  data: ApiEvent[];
}

export interface EventResponse {
  success: boolean;
  data: ApiEvent;
}

export interface AllEventsResponse {
  success: boolean;
  count: number;
  data: ApiEvent[];
}

/**
 * Get all events from database
 */
export const getAllEvents = async (): Promise<ApiEvent[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: AllEventsResponse = await response.json();

    if (!result.success) {
      throw new Error('Failed to fetch events');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
};

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
    throw error;
  }
};

/**
 * Get event by ID
 */
export const getEventById = async (id: string): Promise<ApiEvent> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);

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
    throw error;
  }
};

// Re-export utility functions for backward compatibility
export { formatDate, formatTime, formatPrice, calculateDistance } from '../utils/helpers';

