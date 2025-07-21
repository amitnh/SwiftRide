"use client";

import { useState } from 'react';
import TripPlanner from '../components/TripPlanner';
import RouteResults from '../components/RouteResults';

export default function Home() {
  const [tripResult, setTripResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePlanTrip = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call the API
      // For now, we'll use a simulated response
      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to plan trip');
      }

      const result = await response.json();
      setTripResult(result);
    } catch (err) {
      console.error('Error planning trip:', err);
      setError('Failed to plan trip. Please try again.');
      
      // For demo purposes, set a simulated result if the API is not available
      setTripResult({
        total_time: "35 min",
        segments: {
          scooter_start: {
            from: data.start.name || "Starting location",
            to: "Nearest transit station",
            time: "5 min"
          },
          public_transport: {
            from: "Nearest transit station",
            to: "Destination transit station",
            time: "25 min",
            moovit_link: `https://moovitapp.com/tripplan/israel-1/poi/he?customerId=4908&ref=5&poiType=Country`
          },
          scooter_end: {
            from: "Destination transit station",
            to: data.destination.name || "Destination",
            time: "5 min"
          }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <section className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Plan Your Trip</h2>
          <TripPlanner onSubmit={handlePlanTrip} isLoading={loading} />
        </div>
      </section>

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8" role="alert">
          <p>{error}</p>
        </div>
      )}

      {tripResult && !loading && (
        <RouteResults result={tripResult} />
      )}
    </div>
  );
} 