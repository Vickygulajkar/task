'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapBoundsUpdater({ projects }) {
  const map = useMap();

  useEffect(() => {
    if (projects.length > 0) {
      const validProjects = projects.filter(p => p.lat && p.lng);

      if (validProjects.length > 0) {
        const bounds = L.latLngBounds(
          validProjects.map(p => [p.lat, p.lng])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      }
    }
  }, [projects, map]);

  return null;
}

export default function ProjectsMap({ projects }) {
  const validProjects = projects.filter(p => p.lat && p.lng);

  const defaultCenter = validProjects.length > 0
    ? [validProjects[0].lat, validProjects[0].lng]
    : [20.5937, 78.9629];

  if (typeof window === 'undefined') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={defaultCenter}
      zoom={6}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {validProjects.map((project) => (
        <Marker
          key={project.id}
          position={[project.lat, project.lng]}
          icon={customIcon}
        >
          <Popup>
            <div className="space-y-2">
              <h3 className="font-bold text-base">{project.projectName}</h3>
              <p className="text-sm text-gray-700">
                <strong>Builder:</strong> {project.builderName}
              </p>
              <p className="text-sm text-green-700 font-semibold">
                <strong>Price:</strong> {project.priceRange}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      <MapBoundsUpdater projects={validProjects} />
    </MapContainer>
  );
}
