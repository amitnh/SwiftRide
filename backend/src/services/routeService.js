import * as turf from '@turf/turf';
import { getMoovitTransportTime } from './moovitService.js';

// Scooter average speed in km/h
const SCOOTER_SPEED_KMH = 30;

/**
 * Generate evenly spaced candidate points within a radius around a location
 * @param {Object} location - {lat, lng} coordinates
 * @param {number} radius - Radius in meters
 * @param {number} numPoints - Number of points to generate (default 8)
 * @returns {Array} Array of candidate points with coordinates
 */
export const generateCandidatePoints = (location, radius, numPoints = 8) => {
  // Convert radius from meters to kilometers
  const radiusKm = radius / 1000;
  
  const center = turf.point([location.lng, location.lat]);
  const options = { steps: numPoints, units: 'kilometers' };
  const circle = turf.circle(center, radiusKm, options);
  
  // Get points on the circle
  const points = [];
  
  // Add the original location as a candidate point
  points.push({
    lat: location.lat,
    lng: location.lng,
    name: location.name || 'Original location'
  });
  
  // Add points along the circle
  turf.coordEach(circle, (coord) => {
    points.push({
      lat: coord[1],
      lng: coord[0],
      name: `Generated point`
    });
  });
  
  return points;
};

/**
 * Calculate scooter travel time between two points
 * @param {Object} point1 - {lat, lng} coordinates
 * @param {Object} point2 - {lat, lng} coordinates
 * @returns {number} Travel time in minutes
 */
export const calculateScooterTime = (point1, point2) => {
  const from = turf.point([point1.lng, point1.lat]);
  const to = turf.point([point2.lng, point2.lat]);
  
  // Calculate distance in kilometers
  const distance = turf.distance(from, to, { units: 'kilometers' });
  
  // Calculate time in minutes (distance / speed * 60)
  const timeInMinutes = (distance / SCOOTER_SPEED_KMH) * 60;
  
  return Math.round(timeInMinutes);
};

/**
 * Find the optimal route by considering all combinations of pickup and drop-off points
 * @param {Object} startLocation - Original start location
 * @param {Object} endLocation - Original end location
 * @param {Array} startCandidates - Array of candidate pickup points
 * @param {Array} endCandidates - Array of candidate drop-off points
 * @returns {Object} Optimal route with segments and total time
 */
export const findOptimalRoute = async (startLocation, endLocation, startCandidates, endCandidates) => {
  let bestRoute = null;
  let minTotalTime = Infinity;
  
  // Process a limited number of pairs to avoid excessive Moovit API calls
  const maxCombinations = 5;
  const startSample = startCandidates.slice(0, Math.min(startCandidates.length, maxCombinations));
  const endSample = endCandidates.slice(0, Math.min(endCandidates.length, maxCombinations));
  
  for (const pickupPoint of startSample) {
    for (const dropoffPoint of endSample) {
      // Calculate scooter time from start to pickup
      const scooterStartTime = calculateScooterTime(startLocation, pickupPoint);
      
      // Get public transport time from pickup to dropoff
      const transportTime = await getMoovitTransportTime(pickupPoint, dropoffPoint);
      
      // Calculate scooter time from dropoff to destination
      const scooterEndTime = calculateScooterTime(dropoffPoint, endLocation);
      
      // Calculate total trip time
      const totalTime = scooterStartTime + transportTime + scooterEndTime;
      
      // If this route is faster than our current best, update it
      if (totalTime < minTotalTime) {
        minTotalTime = totalTime;
        bestRoute = {
          total_time: `${totalTime} min`,
          segments: {
            scooter_start: {
              from: startLocation.name || `${startLocation.lat}, ${startLocation.lng}`,
              to: pickupPoint.name || `${pickupPoint.lat}, ${pickupPoint.lng}`,
              time: `${scooterStartTime} min`
            },
            public_transport: {
              from: pickupPoint.name || `${pickupPoint.lat}, ${pickupPoint.lng}`,
              to: dropoffPoint.name || `${dropoffPoint.lat}, ${dropoffPoint.lng}`,
              time: `${transportTime} min`,
              moovit_link: getMoovitLink(pickupPoint, dropoffPoint)
            },
            scooter_end: {
              from: dropoffPoint.name || `${dropoffPoint.lat}, ${dropoffPoint.lng}`,
              to: endLocation.name || `${endLocation.lat}, ${endLocation.lng}`,
              time: `${scooterEndTime} min`
            }
          }
        };
      }
    }
  }
  
  return bestRoute;
};

/**
 * Generate a Moovit deep link for the public transport segment
 * @param {Object} from - Pickup point with lat/lng
 * @param {Object} to - Drop-off point with lat/lng
 * @returns {string} Moovit link
 */
const getMoovitLink = (from, to) => {
  // Format the Moovit deep link
  return `https://moovitapp.com/tripplan/israel-1/poi/he?tll=${from.lat}_${from.lng}&fll=${to.lat}_${to.lng}&customerId=4908&ref=5&poiType=Country`;
}; 