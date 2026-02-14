import { useState, useEffect } from 'react';
import { eventService } from '../services/event.service';
import type { ApiEvent } from '../types/event.types';

export const useEvents = (lat: number, lng: number) => {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await eventService.getNearbyEvents(lat, lng);
        setEvents(fetchedEvents);
        setError(null);
      } catch (err) {
        setError('Failed to fetch events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [lat, lng]);

  return { events, loading, error };
};

export const useEvent = (id: string) => {
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const fetchedEvent = await eventService.getEventById(id);
        setEvent(fetchedEvent);
        setError(null);
      } catch (err) {
        setError('Failed to fetch event');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  return { event, loading, error };
};
