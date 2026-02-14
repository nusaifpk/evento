import { Router } from 'express';
import { getNearbyEvents, getEventById } from '../controllers/event.controller.js';

const router = Router();

/**
 * @route   GET /api/events/nearby
 * @desc    Get events within 20km radius
 * @access  Public
 * @query   lat - Latitude
 * @query   lng - Longitude
 */
router.get('/nearby', getNearbyEvents);

/**
 * @route   GET /api/events/:id
 * @desc    Get event by ID
 * @access  Public
 */
router.get('/:id', getEventById);

export default router;

