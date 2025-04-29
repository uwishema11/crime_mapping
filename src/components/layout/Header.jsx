import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="p-2 text-gray-600 hover:text-gray-800 relative">
                        <Bell className="w-6 h-6" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Admin</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 