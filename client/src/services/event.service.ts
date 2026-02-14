// Event-specific service functions
import { getNearbyEvents, getEventById, type ApiEvent } from './api';

export const eventService = {
  // Get events near a location
  getNearbyEvents: async (lat: number, lng: number): Promise<ApiEvent[]> => {
    return getNearbyEvents(lat, lng);
  },

  // Get single event by ID
  getEventById: async (id: string): Promise<ApiEvent> => {
    return getEventById(id);
  },

  // Search events by query
  searchEvents: async (query: string): Promise<ApiEvent[]> => {
    // TODO: Implement search API call
    return [];
  },

  // Get saved events for user
  getSavedEvents: async (): Promise<ApiEvent[]> => {
    // TODO: Implement saved events API call
    return [];
  }
};
