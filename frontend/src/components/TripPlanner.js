"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';

const TripPlanner = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [radius, setRadius] = useState(2);

  const submitForm = (data) => {
    // Convert form data to the format expected by the API
    const formattedData = {
      start: {
        name: data.startLocation,
        lat: parseFloat(data.startLat),
        lng: parseFloat(data.startLng),
      },
      destination: {
        name: data.endLocation,
        lat: parseFloat(data.endLat),
        lng: parseFloat(data.endLng),
      },
      radius: radius * 1000, // Convert km to meters
    };

    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
      {/* Start Location */}
      <div className="space-y-2">
        <h3 className="font-medium">Start Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              {...register('startLocation', { required: 'Start location is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter start location"
            />
            {errors.startLocation && <p className="mt-1 text-sm text-red-600">{errors.startLocation.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Latitude</label>
            <input
              type="number"
              step="any"
              {...register('startLat', { required: 'Latitude is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 32.0853"
            />
            {errors.startLat && <p className="mt-1 text-sm text-red-600">{errors.startLat.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Longitude</label>
            <input
              type="number"
              step="any"
              {...register('startLng', { required: 'Longitude is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 34.7818"
            />
            {errors.startLng && <p className="mt-1 text-sm text-red-600">{errors.startLng.message}</p>}
          </div>
        </div>
      </div>

      {/* End Location */}
      <div className="space-y-2">
        <h3 className="font-medium">Destination</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              {...register('endLocation', { required: 'Destination is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter destination"
            />
            {errors.endLocation && <p className="mt-1 text-sm text-red-600">{errors.endLocation.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Latitude</label>
            <input
              type="number"
              step="any"
              {...register('endLat', { required: 'Latitude is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 32.1133"
            />
            {errors.endLat && <p className="mt-1 text-sm text-red-600">{errors.endLat.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Longitude</label>
            <input
              type="number"
              step="any"
              {...register('endLng', { required: 'Longitude is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 34.8043"
            />
            {errors.endLng && <p className="mt-1 text-sm text-red-600">{errors.endLng.message}</p>}
          </div>
        </div>
      </div>

      {/* Radius Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">Scooter Radius: {radius} km</label>
        </div>
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.5"
          value={radius}
          onChange={(e) => setRadius(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0.5 km</span>
          <span>5 km</span>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Planning Trip...' : 'Plan Trip'}
        </button>
      </div>
    </form>
  );
};

export default TripPlanner; 