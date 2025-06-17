import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import HeatmapLayer from './HeatMap';
import { useCrime } from '@/store/crime';
const DefaultIcon = new L.Icon({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function RwandaMap() {
  const { crimes, fetchCrimes } = useCrime();
  useEffect(() => {
    fetchCrimes({});
  }, [fetchCrimes]);

  const crimeReports = crimes.filter((r) => r.latitude && r.longitude);
  const heatPoints = crimeReports.map((r) => [r.latitude, r.longitude]);

  const rwandaCenter = [-1.95, 30.06];

  return (
    <MapContainer
      center={rwandaCenter}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: '500px', width: '100%' }}
      maxBounds={[
        [-2.9, 28.8],
        [-1.0, 30.9],
      ]}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <HeatmapLayer points={heatPoints} />

      {crimeReports.map((report) => (
        <Marker
          key={report.id}
          position={[report.latitude, report.longitude]}
          icon={DefaultIcon} 
        >
          <Popup>
            <strong>{report.crime_name}</strong>
            <br />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
