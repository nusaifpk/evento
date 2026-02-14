import { Request, Response } from 'express';
import { Event } from '../models/Event.js';

interface NearbyEventsQuery {
  lat?: string;
  lng?: string;
}

/**
 * Get events within 20km radius of given coordinates
 * Sorted by distance (nearest first)
 */
export const getNearbyEvents = async (
  req: Request<{}, {}, {}, NearbyEventsQuery>,
  res: Response
): Promise<void> => {
  try {
    const { lat, lng } = req.query;

    // Validate coordinates
    if (!lat || !lng) {
      res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required',
      });
      return;
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      res.status(400).json({
        success: false,
        error: 'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180',
      });
      return;
    }

    // 20km radius in meters
    const radiusInMeters = 20 * 1000;

    // Geospatial query using $near
    const events = await Event.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusInMeters,
        },
      },
    })
      .select('-__v')
      .lean();

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error('Error fetching nearby events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch nearby events',
    });
  }
};

/**
 * Get event by ID
 */
export const getEventById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Event ID is required',
      });
      return;
    }

    const event = await Event.findById(id).select('-__v').lean();

    if (!event) {
      res.status(404).json({
        success: false,
        error: 'Event not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    
    // Handle invalid ObjectId format
    if (error instanceof Error && error.name === 'CastError') {
      res.status(400).json({
        success: false,
        error: 'Invalid event ID format',
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch event',
    });
  }
};

