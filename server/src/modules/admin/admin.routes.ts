import { Router } from 'express';
import { getAllEvents, getEventById } from '../event/event.controller.js';
import { Event } from '../event/event.model.js';
import { Request, Response } from 'express';

const router = Router();

/**
 * @route   GET /api/admin/events
 * @desc    Get all events (admin view)
 * @access  Admin
 */
router.get('/events', (req, res) => {
  console.log('[Admin Routes] GET /events called');
  getAllEvents(req, res);
});

/**
 * @route   GET /api/admin/events/:id
 * @desc    Get event by ID (admin view)
 * @access  Admin
 */
router.get('/events/:id', getEventById);

/**
 * @route   POST /api/admin/events
 * @desc    Create new event
 * @access  Admin
 */
router.post('/events', async (req: Request, res: Response) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    console.error('Error creating event:', error);
    res.status(400).json({
      success: false,
      error: 'Failed to create event',
      message: error.message,
    });
  }
});

/**
 * @route   PUT /api/admin/events/:id
 * @desc    Update event
 * @access  Admin
 */
router.put('/events/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Fetch current event to validate dates properly
    const currentEvent = await Event.findById(id);
    if (!currentEvent) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }
    
    // Determine the dates to validate (use new values if provided, otherwise current)
    const startDate = req.body.startDate ? new Date(req.body.startDate) : currentEvent.startDate;
    const endDate = req.body.endDate ? new Date(req.body.endDate) : currentEvent.endDate;
    
    // Validate dates
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        error: 'End date must be after start date',
      });
    }
    
    // Update event - disable schema validators and handle validation manually
    const event = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: false, // Disable schema validators to avoid the endDate > startDate issue
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    console.error('Error updating event:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        messages: messages,
      });
    }
    
    res.status(400).json({
      success: false,
      error: 'Failed to update event',
      message: error.message,
    });
  }
});

/**
 * @route   DELETE /api/admin/events/:id
 * @desc    Delete event
 * @access  Admin
 */
router.delete('/events/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    res.status(400).json({
      success: false,
      error: 'Failed to delete event',
      message: error.message,
    });
  }
});

export default router;

