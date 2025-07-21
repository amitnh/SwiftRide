"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import Leaflet map component dynamically to avoid SSR issues
const RouteMap = dynamic(() => import('./RouteMap'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg"></div>
});

const RouteResults = ({ result }) => {
  // Ensure result has the expected structure
  if (!result || !result.segments) {
    return <div>No route data available.</div>;
  }

  const { scooter_start, public_transport, scooter_end } = result.segments;

  // Extract coordinates for the map (would be set properly in a real implementation)
  const routePoints = {
    start: { name: scooter_start.from, lat: 32.0853, lng: 34.7818 },
    pickup: { name: scooter_start.to, lat: 32.0953, lng: 34.7918 },
    dropoff: { name: public_transport.to, lat: 32.1053, lng: 34.8018 },
    end: { name: scooter_end.to, lat: 32.1153, lng: 34.8118 }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-bold mb-4">Trip Results</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Total Time:</h3>
          <span className="text-xl font-bold text-blue-600">{result.total_time}</span>
        </div>
        
        <RouteMap points={routePoints} />
      </div>
      
      <div className="space-y-6">
        {/* Scooter Start Leg */}
        <div className="border-l-4 border-green-400 pl-4">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-green-100 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59l-2.22-2.22a.75.75 0 10-1.06 1.06l3.5 3.5a.75.75 0 001.06 0l3.5-3.5a.75.75 0 10-1.06-1.06L10.75 11.34V6.75z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="font-medium text-lg">Scooter to Public Transport</h4>
            <span className="ml-auto font-semibold">{scooter_start.time}</span>
          </div>
          <div className="ml-10">
            <p><span className="font-semibold">From:</span> {scooter_start.from}</p>
            <p><span className="font-semibold">To:</span> {scooter_start.to}</p>
          </div>
        </div>
        
        {/* Public Transport Leg */}
        <div className="border-l-4 border-blue-400 pl-4">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 16H6V8H8V16Z" />
                <path d="M14 8H12V16H14V8Z" />
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1H6z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="font-medium text-lg">Public Transport</h4>
            <span className="ml-auto font-semibold">{public_transport.time}</span>
          </div>
          <div className="ml-10">
            <p><span className="font-semibold">From:</span> {public_transport.from}</p>
            <p><span className="font-semibold">To:</span> {public_transport.to}</p>
            <a
              href={public_transport.moovit_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Open in Moovit
            </a>
          </div>
        </div>
        
        {/* Scooter End Leg */}
        <div className="border-l-4 border-red-400 pl-4">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-red-100 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13.25a.75.75 0 00-1.5 0v4.59L7.03 7.22a.75.75 0 00-1.06 1.06l3.5 3.5a.75.75 0 001.06 0l3.5-3.5a.75.75 0 10-1.06-1.06L10.75 9.34v-4.6z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="font-medium text-lg">Scooter to Destination</h4>
            <span className="ml-auto font-semibold">{scooter_end.time}</span>
          </div>
          <div className="ml-10">
            <p><span className="font-semibold">From:</span> {scooter_end.from}</p>
            <p><span className="font-semibold">To:</span> {scooter_end.to}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteResults; 