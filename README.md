# SwiftRide - Hybrid Trip Planner

SwiftRide helps users plan the fastest trip combining a scooter and public transport. The user enters a start location, destination, and optionally a radius (default 2 km).

## Overview

The app finds the optimal pickup and drop-off points within the radius to minimize overall travel time:

1. Scooter from the starting point to a nearby public transport station
2. Public transport for the main journey
3. Scooter from the arrival station to the final destination

The app provides a route summary, total estimated travel time, and a Moovit link for the public transport segment.

## Features

- Optimize door-to-door trips mixing scooter and public transport
- Configurable scooter radius (default 2 km)
- Identify fastest combination of travel modes
- Clear route instructions with Moovit integration
- Visual route map

## Project Structure

```
SwiftRide/
├── backend/           # Express.js server
│   ├── src/           # Backend source code
│   ├── package.json   # Backend dependencies
│   └── .env           # Environment variables (git-ignored)
│
├── frontend/          # Next.js frontend
│   ├── src/           # Frontend source code
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
│
└── README.md          # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## API Documentation

The API will be available at `http://localhost:5000/api` with the following endpoints:

- `POST /api/plan-trip` - Plan a trip with start, destination, and radius

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: Next.js, React
- **Maps**: Leaflet/Mapbox
- **Geospatial**: Turf.js
- **Web Automation**: Puppeteer for Moovit integration
