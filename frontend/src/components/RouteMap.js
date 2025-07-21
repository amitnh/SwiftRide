"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icon issue in Next.js
const createIcon = (color) => {
  return new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

const RouteMap = ({ points }) => {
  const [isMounted, setIsMounted] = useState(false);

  // Only render on client-side
  useEffect(() => {
    setIsMounted(true);
    
    // Clean up any Leaflet elements on unmount
    return () => {
      // Clean up if needed
    };
  }, []);

  if (!isMounted) {
    return <div className="h-64 bg-gray-200 rounded-lg"></div>;
  }

  const { start, pickup, dropoff, end } = points;
  
  // Calculate center point of the route
  const centerLat = (start.lat + end.lat) / 2;
  const centerLng = (start.lng + end.lng) / 2;
  
  // Define polylines for different segments
  const scooterStartLine = [
    [start.lat, start.lng],
    [pickup.lat, pickup.lng]
  ];
  
  const publicTransportLine = [
    [pickup.lat, pickup.lng],
    [dropoff.lat, dropoff.lng]
  ];
  
  const scooterEndLine = [
    [dropoff.lat, dropoff.lng],
    [end.lat, end.lng]
  ];

  return (
    <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
      <MapContainer 
        center={[centerLat, centerLng]} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }} 
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Start Marker */}
        <Marker position={[start.lat, start.lng]} icon={createIcon('#22c55e')}>
          <Popup>
            <b>Start:</b> {start.name}
          </Popup>
        </Marker>
        
        {/* Pickup Marker */}
        <Marker position={[pickup.lat, pickup.lng]} icon={createIcon('#3b82f6')}>
          <Popup>
            <b>Public Transport Start:</b> {pickup.name}
          </Popup>
        </Marker>
        
        {/* Dropoff Marker */}
        <Marker position={[dropoff.lat, dropoff.lng]} icon={createIcon('#3b82f6')}>
          <Popup>
            <b>Public Transport End:</b> {dropoff.name}
          </Popup>
        </Marker>
        
        {/* End Marker */}
        <Marker position={[end.lat, end.lng]} icon={createIcon('#ef4444')}>
          <Popup>
            <b>Destination:</b> {end.name}
          </Popup>
        </Marker>
        
        {/* Route Lines */}
        <Polyline positions={scooterStartLine} color="#22c55e" weight={4} dashArray="5,10" />
        <Polyline positions={publicTransportLine} color="#3b82f6" weight={4} />
        <Polyline positions={scooterEndLine} color="#ef4444" weight={4} dashArray="5,10" />
      </MapContainer>
    </div>
  );
};

export default RouteMap; 