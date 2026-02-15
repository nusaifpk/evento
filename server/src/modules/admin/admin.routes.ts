import { Router } from 'express';
import { getAllEvents, getEventById } from '../event/event.controller.js';
import { Event } from '../event/event.model.js';
import { Request, Response } from 'express';

const router = Router();

/**
 * @route   GET /api/admin/events
 * @desc    Get all approved events (admin view)
 * @access  Admin
 */
router.get('/events', async (req: Request, res: Response) => {
  try {
    // Admin can see all approved events
    const events = await Event.find({ status: 'approved' })
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error('Error fetching approved events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events',
    });
  }
});

/**
 * @route   GET /api/admin/events/pending
 * @desc    Get all pending events
 * @access  Admin
 */
router.get('/events/pending', async (req: Request, res: Response) => {
  try {
    const events = await Event.find({ status: 'pending' })
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error('Error fetching pending events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending events',
    });
  }
});

/**
 * @route   GET /api/admin/events/:id
 * @desc    Get event by ID (admin view - can see any status)
 * @access  Admin
 */
router.get('/events/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Event ID is required',
      });
    }

    // Admin can see events of any status
    const event = await Event.findById(id).select('-__v').lean();

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
    console.error('Error fetching event:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID format',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch event',
    });
  }
});

/**
 * @route   POST /api/admin/events
 * @desc    Create new event (auto-approved)
 * @access  Admin
 */
router.post('/events', async (req: Request, res: Response) => {
  try {
    const eventData = {
      ...req.body,
      status: 'approved', // Admin-created events are auto-approved
    };
    const event = new Event(eventData);
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
 * @route   PATCH /api/admin/events/:id/approve
 * @desc    Approve pending event
 * @access  Admin
 */
router.patch('/events/:id/approve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event approved successfully',
      data: event,
    });
  } catch (error: any) {
    console.error('Error approving event:', error);
    res.status(400).json({
      success: false,
      error: 'Failed to approve event',
      message: error.message,
    });
  }
});

/**
 * @route   PATCH /api/admin/events/:id/reject
 * @desc    Reject pending event
 * @access  Admin
 */
router.patch('/events/:id/reject', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event rejected successfully',
      data: event,
    });
  } catch (error: any) {
    console.error('Error rejecting event:', error);
    res.status(400).json({
      success: false,
      error: 'Failed to reject event',
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

