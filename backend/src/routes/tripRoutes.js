import express from 'express';
import { planTrip } from '../controllers/tripController.js';

const router = express.Router();

/**
 * @route POST /api/plan-trip
 * @desc Plan a trip combining scooter and public transport
 * @access Public
 * @body {
 *  start: {lat, lng, name},
 *  destination: {lat, lng, name},
 *  radius: number (optional, default 2000)
 * }
 */
router.post('/plan-trip', planTrip);

export default router; 