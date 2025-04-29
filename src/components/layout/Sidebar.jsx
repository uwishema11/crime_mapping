import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Map,
    BarChart2,
    FileText,
    Settings,
    Users,
    AlertCircle
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: Map, label: 'Map View' },
        { path: '/analytics', icon: BarChart2, label: 'Analytics' },
        { path: '/reports', icon: FileText, label: 'Reports' },
        { path: '/users', icon: Users, label: 'Users' },
        { path: '/alerts', icon: AlertCircle, label: 'Alerts' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="w-64 bg-white shadow-lg">
            <div className="p-4">
                <h1 className="text-2xl font-bold text-gray-800">Crime Map</h1>
            </div>
            <nav className="mt-6">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 ${isActive ? 'bg-gray-100 text-blue-600' : ''
                                }`}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar; 