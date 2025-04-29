import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Filter, MapPin } from 'lucide-react';

const MapView = () => {
    const [filters, setFilters] = useState({
        crimeType: 'all',
        dateRange: '7d',
        severity: 'all'
    });

    // Mock data for crime incidents
    const crimeData = [
        { id: 1, lat: 51.505, lng: -0.09, type: 'theft', severity: 'medium', description: 'Pickpocketing incident' },
        { id: 2, lat: 51.51, lng: -0.1, type: 'assault', severity: 'high', description: 'Physical altercation' },
        { id: 3, lat: 51.52, lng: -0.11, type: 'vandalism', severity: 'low', description: 'Property damage' },
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="bg-white p-4 shadow-sm mb-4">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <select
                            className="border rounded-lg px-3 py-2"
                            value={filters.crimeType}
                            onChange={(e) => setFilters({ ...filters, crimeType: e.target.value })}
                        >
                            <option value="all">All Crime Types</option>
                            <option value="theft">Theft</option>
                            <option value="assault">Assault</option>
                            <option value="vandalism">Vandalism</option>
                        </select>
                    </div>

                    <select
                        className="border rounded-lg px-3 py-2"
                        value={filters.dateRange}
                        onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                    >
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                    </select>

                    <select
                        className="border rounded-lg px-3 py-2"
                        value={filters.severity}
                        onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                    >
                        <option value="all">All Severities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-lg shadow-sm">
                <MapContainer
                    center={[51.505, -0.09]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {crimeData.map((crime) => (
                        <Marker key={crime.id} position={[crime.lat, crime.lng]}>
                            <Popup>
                                <div className="p-2">
                                    <h3 className="font-semibold">{crime.type}</h3>
                                    <p className="text-sm">{crime.description}</p>
                                    <p className="text-sm text-gray-500">Severity: {crime.severity}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapView; 