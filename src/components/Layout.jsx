import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { Home, Map, BarChart2, FileText, Users, Bell, Settings, LogOut, User, ChevronDown, Loader2 } from 'lucide-react';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Mock user data
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Admin',
        avatar: null
    };

    // Mock notifications
    const notifications = [
        {
            id: 1,
            title: 'New Report Submitted',
            message: 'A new crime report has been submitted in Downtown area',
            time: '5 min ago',
            unread: true
        },
        {
            id: 2,
            title: 'Alert: High Crime Activity',
            message: 'Increased criminal activity detected in West District',
            time: '1 hour ago',
            unread: true
        },
        {
            id: 3,
            title: 'System Update',
            message: 'System maintenance scheduled for tonight',
            time: '2 hours ago',
            unread: false
        }
    ];

    const navigationItems = [
        { name: 'Dashboard', icon: Home, path: '/' },
        { name: 'Map', icon: Map, path: '/map' },
        { name: 'Analytics', icon: BarChart2, path: '/analytics' },
        { name: 'Reports', icon: FileText, path: '/reports' },
        { name: 'Users', icon: Users, path: '/users' },
        { name: 'Alerts', icon: Bell, path: '/alerts' },
        { name: 'Settings', icon: Settings, path: '/settings' }
    ];

    const handleNavigation = (path) => {
        setIsLoading(true);
        navigate(path);
        // Simulate loading state
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    };

    const handleLogout = () => {
        // Implement logout logic here
        console.log('Logging out...');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-white h-screen shadow-sm fixed">
                    <div className="p-4">
                        <h1 className="text-2xl font-bold text-blue-600">Crime Mapping</h1>
                    </div>
                    <nav className="mt-4">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 ${isActive ? 'bg-blue-50 text-blue-600' : ''
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 ml-64">
                    {/* Top Bar */}
                    <header className="bg-white h-16 shadow-sm fixed w-full z-10">
                        <div className="flex items-center justify-end h-full px-6">
                            <div className="flex items-center space-x-4">
                                {/* Notifications */}
                                <div className="relative">
                                    <button
                                        className="p-2 hover:bg-gray-100 rounded-full relative"
                                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    >
                                        <Bell className="w-5 h-5 text-gray-600" />
                                        {notifications.some(n => n.unread) && (
                                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                        )}
                                    </button>

                                    {/* Notifications Dropdown */}
                                    {isNotificationsOpen && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <h3 className="font-semibold">Notifications</h3>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className={`px-4 py-3 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-medium text-sm">{notification.title}</h4>
                                                            <span className="text-xs text-gray-500">{notification.time}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* User Profile */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2"
                                    >
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                            {user.avatar || user.name.charAt(0)}
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-gray-600" />
                                    </button>

                                    {/* Profile Dropdown */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-gray-600">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={() => handleNavigation('/profile')}
                                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                                            >
                                                <User className="w-4 h-4" />
                                                <span>Profile</span>
                                            </button>
                                            <button
                                                onClick={() => handleNavigation('/settings')}
                                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                                            >
                                                <Settings className="w-4 h-4" />
                                                <span>Settings</span>
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="pt-24 px-6 pb-8">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                        ) : (
                            <Outlet />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout; 