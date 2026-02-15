import { Request, Response } from 'express';
import { Event } from './event.model.js';

interface NearbyEventsQuery {
  lat?: string;
  lng?: string;
}

/**
 * Get events within 20km radius of given coordinates (only approved)
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

    // Geospatial query using $near - only approved events
    const events = await Event.find({
      status: 'approved',
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
 * Get all events from database (only approved)
 */
export const getAllEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const events = await Event.find({ status: 'approved' })
      .select('-__v')
      .sort({ createdAt: -1 }) // Sort by creation date descending (newest first)
      .lean();

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events',
    });
  }
};

/**
 * Submit event for approval (public route)
 */
export const submitEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      category,
      address,
      city,
      latitude,
      longitude,
      startDate,
      endDate,
      price,
      imageUrl,
      organizerName,
      ticketLink,
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !address || !city) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: title, description, category, address, city',
      });
      return;
    }

    if (latitude === undefined || longitude === undefined) {
      res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required',
      });
      return;
    }

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        error: 'Start date and end date are required',
      });
      return;
    }

    // Validate coordinates
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (
      isNaN(lat) ||
      isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      res.status(400).json({
        success: false,
        error: 'Invalid coordinates',
      });
      return;
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      res.status(400).json({
        success: false,
        error: 'End date must be after start date',
      });
      return;
    }

    // Create event with pending status
    const event = new Event({
      title,
      description,
      category,
      location: {
        type: 'Point',
        coordinates: [lng, lat], // [longitude, latitude]
      },
      address,
      city,
      startDate: start,
      endDate: end,
      price: price || 0,
      images: imageUrl ? [imageUrl] : [],
      organizerName: organizerName || 'Community Member',
      status: 'pending',
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event submitted successfully. It will be reviewed by an admin.',
      data: {
        id: event._id,
        title: event.title,
        status: event.status,
      },
    });
  } catch (error: any) {
    console.error('Error submitting event:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        messages,
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Failed to submit event',
      message: error.message,
    });
  }
};

/**
 * Get event by ID (only approved)
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

    const event = await Event.findOne({ _id: id, status: 'approved' })
      .select('-__v')
      .lean();

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

