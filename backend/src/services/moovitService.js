import puppeteer from 'puppeteer';

/**
 * Get estimated travel time using Moovit for public transport
 * @param {Object} from - Starting point with {lat, lng}
 * @param {Object} to - Ending point with {lat, lng}
 * @returns {number} Estimated travel time in minutes
 */
export const getMoovitTransportTime = async (from, to) => {
  // For development, return a simulated value
  // In production, this would be replaced with actual Puppeteer scraping
  if (process.env.NODE_ENV === 'development') {
    return simulateTransportTime(from, to);
  }
  
  const browser = await puppeteer.launch({
    headless: true, // Use headless browser
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to Moovit trip planner
    const moovitUrl = `https://moovitapp.com/tripplan/israel-1/poi/he?tll=${from.lat}_${from.lng}&fll=${to.lat}_${to.lng}&customerId=4908&ref=5&poiType=Country`;
    await page.goto(moovitUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for results to load
    await page.waitForSelector('.trip-option', { timeout: 30000 });
    
    // Extract the travel time from the first result
    const travelTimeText = await page.evaluate(() => {
      const tripOption = document.querySelector('.trip-option');
      if (!tripOption) return null;
      
      const timeElement = tripOption.querySelector('.time-tag');
      return timeElement ? timeElement.textContent.trim() : null;
    });
    
    if (!travelTimeText) {
      throw new Error('Could not extract travel time from Moovit');
    }
    
    // Convert "1h 20m" format to minutes
    const minutes = parseTimeToMinutes(travelTimeText);
    
    return minutes;
  } catch (error) {
    console.error('Error scraping Moovit:', error);
    // Fallback to simulation if scraping fails
    return simulateTransportTime(from, to);
  } finally {
    await browser.close();
  }
};

/**
 * Simulate transport time for development or as a fallback
 * @param {Object} from - Starting point
 * @param {Object} to - Ending point
 * @returns {number} Simulated travel time in minutes
 */
const simulateTransportTime = (from, to) => {
  // Calculate rough distance
  const distanceKm = calculateDistanceKm(from.lat, from.lng, to.lat, to.lng);
  
  // Assume average speed of public transport is 25 km/h
  // Add random variation and waiting time
  const baseTime = (distanceKm / 25) * 60; // Convert to minutes
  const waitingTime = Math.floor(Math.random() * 10) + 5; // 5-15 minutes waiting
  
  return Math.round(baseTime + waitingTime);
};

/**
 * Calculate distance between two points in km using Haversine formula
 */
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

/**
 * Parse time string like "1h 20m" to minutes
 * @param {string} timeString - Time string to parse
 * @returns {number} Total minutes
 */
const parseTimeToMinutes = (timeString) => {
  let totalMinutes = 0;
  
  // Extract hours
  const hourMatch = timeString.match(/(\d+)h/);
  if (hourMatch) {
    totalMinutes += parseInt(hourMatch[1]) * 60;
  }
  
  // Extract minutes
  const minMatch = timeString.match(/(\d+)m/);
  if (minMatch) {
    totalMinutes += parseInt(minMatch[1]);
  }
  
  return totalMinutes || 30; // Default to 30 minutes if parsing fails
}; 