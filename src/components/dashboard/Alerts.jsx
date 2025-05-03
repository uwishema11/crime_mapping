import React, { useState } from 'react';
import { Bell, MapPin, Clock, AlertTriangle } from 'lucide-react';

const Alerts = () => {
    const [activeTab, setActiveTab] = useState('all');

    // Mock data for alerts
    const alerts = [
        {
            id: 1,
            type: 'High',
            title: 'Multiple Thefts Reported',
            location: 'Downtown Area',
            time: '10 minutes ago',
            description: 'Several theft incidents reported in the downtown area within the last hour.'
        },
        {
            id: 2,
            type: 'Medium',
            title: 'Suspicious Activity',
            location: 'Central Park',
            time: '30 minutes ago',
            description: 'Reports of suspicious individuals in Central Park after dark.'
        },
        {
            id: 3,
            type: 'Low',
            title: 'Vandalism Incident',
            location: 'West Side',
            time: '1 hour ago',
            description: 'Minor vandalism reported in the West Side neighborhood.'
        },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Alerts</h2>
                    <div className="flex space-x-2">
                        <button
                            className={`px-4 py-2 rounded-lg ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                                }`}
                            onClick={() => setActiveTab('all')}
                        >
                            All
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${activeTab === 'high' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                                }`}
                            onClick={() => setActiveTab('high')}
                        >
                            High Priority
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${activeTab === 'medium' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-600'
                                }`}
                            onClick={() => setActiveTab('medium')}
                        >
                            Medium Priority
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${activeTab === 'low' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                                }`}
                            onClick={() => setActiveTab('low')}
                        >
                            Low Priority
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`p-4 rounded-lg border ${alert.type === 'High' ? 'border-red-200 bg-red-50' :
                                    alert.type === 'Medium' ? 'border-yellow-200 bg-yellow-50' :
                                        'border-green-200 bg-green-50'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-full ${alert.type === 'High' ? 'bg-red-100' :
                                            alert.type === 'Medium' ? 'bg-yellow-100' :
                                                'bg-green-100'
                                        }`}>
                                        <AlertTriangle className={`w-5 h-5 ${alert.type === 'High' ? 'text-red-600' :
                                                alert.type === 'Medium' ? 'text-yellow-600' :
                                                    'text-green-600'
                                            }`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{alert.title}</h3>
                                        <div className="flex items-center space-x-4 mt-1">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {alert.location}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {alert.time}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <Bell className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="mt-3 text-sm text-gray-600">{alert.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Alerts; 