import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, Plus, CheckCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Reports = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const location = useLocation();

    useEffect(() => {
        if (location.state?.success) {
            setSuccessMessage(location.state.success);
            // Clear the success message after 5 seconds
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    // Mock data for reports
    const reports = [
        {
            id: 1,
            date: '2024-04-22',
            type: 'Theft',
            location: '123 Main St',
            severity: 'Medium',
            status: 'Open',
            officer: 'John Doe'
        },
        {
            id: 2,
            date: '2024-04-21',
            type: 'Assault',
            location: '456 Oak Ave',
            severity: 'High',
            status: 'In Progress',
            officer: 'Jane Smith'
        },
        {
            id: 3,
            date: '2024-04-20',
            type: 'Vandalism',
            location: '789 Pine Rd',
            severity: 'Low',
            status: 'Closed',
            officer: 'Mike Johnson'
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Crime Reports</h1>
                <Link
                    to="/reports/new"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    New Report
                </Link>
            </div>

            {successMessage && (
                <div className="p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {successMessage}
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Crime Reports</h2>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <Download className="w-5 h-5" />
                        <span>Export</span>
                    </button>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search reports..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <span>Filters</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officer</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.severity === 'High' ? 'bg-red-100 text-red-800' :
                                            report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {report.severity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                                            report.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.officer}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports; 