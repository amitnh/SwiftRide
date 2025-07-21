import { generateCandidatePoints, calculateScooterTime, findOptimalRoute } from '../services/routeService.js';
import { getMoovitTransportTime } from '../services/moovitService.js';

/**
 * Plan a trip combining scooter and public transport
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const planTrip = async (req, res) => {
  try {
    const { start, destination, radius = 2000 } = req.body;

    // Validate inputs
    if (!start || !destination) {
      return res.status(400).json({ error: 'Start and destination are required' });
    }

    if (!start.lat || !start.lng || !destination.lat || !destination.lng) {
      return res.status(400).json({ error: 'Start and destination must include lat and lng coordinates' });
    }

    // 1. Generate candidate points within radius around start and destination
    const startCandidatePoints = await generateCandidatePoints(start, radius);
    const destCandidatePoints = await generateCandidatePoints(destination, radius);

    // 2. Find the optimal route by considering all combinations
    const optimalRoute = await findOptimalRoute(
      start, 
      destination, 
      startCandidatePoints, 
      destCandidatePoints
    );

    return res.status(200).json(optimalRoute);
  } catch (error) {
    console.error('Error planning trip:', error);
    return res.status(500).json({ error: 'Failed to plan trip', details: error.message });
  }
}; 