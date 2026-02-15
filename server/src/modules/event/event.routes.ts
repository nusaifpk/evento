import { Router } from 'express';
import { getAllEvents, getNearbyEvents, getEventById, submitEvent } from './event.controller.js';

const router = Router();

/**
 * @route   GET /api/events
 * @desc    Get all approved events from database
 * @access  Public
 */
router.get('/', getAllEvents);
router.get('', getAllEvents); // Handle both /events and /events/

/**
 * @route   POST /api/events/submit
 * @desc    Submit event for admin approval
 * @access  Public
 */
router.post('/submit', submitEvent);

/**
 * @route   GET /api/events/nearby
 * @desc    Get events within 20km radius (only approved)
 * @access  Public
 * @query   lat - Latitude
 * @query   lng - Longitude
 */
router.get('/nearby', getNearbyEvents);

/**
 * @route   GET /api/events/:id
 * @desc    Get event by ID (only approved)
 * @access  Public
 */
router.get('/:id', getEventById);

export default router;

