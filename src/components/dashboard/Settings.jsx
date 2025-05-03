import React, { useState } from 'react';
import { Bell, Lock, Map, Globe, Moon, Sun, Monitor } from 'lucide-react';

const Settings = () => {
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: true,
            desktop: false,
            alerts: true
        },
        security: {
            twoFactor: false,
            sessionTimeout: '30',
            passwordExpiry: '90'
        },
        map: {
            defaultView: 'satellite',
            showHeatmap: true,
            clusterMarkers: true,
            autoRefresh: '5'
        },
        appearance: {
            theme: 'system',
            language: 'en',
            timezone: 'UTC'
        }
    });

    const handleSettingChange = (category, setting, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [setting]: value
            }
        }));
    };

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' }
    ];

    const timezones = [
        'UTC',
        'America/New_York',
        'Europe/London',
        'Asia/Tokyo'
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notifications Settings */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 mb-4">
                        <Bell className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold">Notifications</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="font-medium">Email Notifications</label>
                                <p className="text-sm text-gray-500">Receive updates via email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.notifications.email}
                                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="font-medium">Push Notifications</label>
                                <p className="text-sm text-gray-500">Receive mobile push notifications</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.notifications.push}
                                    onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 mb-4">
                        <Lock className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold">Security</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="font-medium">Two-Factor Authentication</label>
                                <p className="text-sm text-gray-500">Add an extra layer of security</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.security.twoFactor}
                                    onChange={(e) => handleSettingChange('security', 'twoFactor', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div>
                            <label className="font-medium">Session Timeout (minutes)</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={settings.security.sessionTimeout}
                                onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                            >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="60">1 hour</option>
                                <option value="120">2 hours</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Map Settings */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 mb-4">
                        <Map className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold">Map Settings</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="font-medium">Default View</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={settings.map.defaultView}
                                onChange={(e) => handleSettingChange('map', 'defaultView', e.target.value)}
                            >
                                <option value="standard">Standard</option>
                                <option value="satellite">Satellite</option>
                                <option value="terrain">Terrain</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="font-medium">Show Heatmap</label>
                                <p className="text-sm text-gray-500">Display crime density heatmap</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.map.showHeatmap}
                                    onChange={(e) => handleSettingChange('map', 'showHeatmap', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Appearance Settings */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 mb-4">
                        <Globe className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold">Appearance</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="font-medium">Theme</label>
                            <div className="mt-2 grid grid-cols-3 gap-2">
                                <button
                                    className={`flex items-center justify-center space-x-2 p-2 rounded-lg border ${settings.appearance.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                        }`}
                                    onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                                >
                                    <Sun className="w-4 h-4" />
                                    <span>Light</span>
                                </button>
                                <button
                                    className={`flex items-center justify-center space-x-2 p-2 rounded-lg border ${settings.appearance.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                        }`}
                                    onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                                >
                                    <Moon className="w-4 h-4" />
                                    <span>Dark</span>
                                </button>
                                <button
                                    className={`flex items-center justify-center space-x-2 p-2 rounded-lg border ${settings.appearance.theme === 'system' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                        }`}
                                    onClick={() => handleSettingChange('appearance', 'theme', 'system')}
                                >
                                    <Monitor className="w-4 h-4" />
                                    <span>System</span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="font-medium">Language</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={settings.appearance.language}
                                onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                            >
                                {languages.map(lang => (
                                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="font-medium">Timezone</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={settings.appearance.timezone}
                                onChange={(e) => handleSettingChange('appearance', 'timezone', e.target.value)}
                            >
                                {timezones.map(tz => (
                                    <option key={tz} value={tz}>{tz}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Settings; 