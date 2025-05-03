import React from 'react';
import { Map, BarChart2, FileText, AlertTriangle, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Main = () => {
  const quickStats = [
    { icon: Map, label: 'Active Incidents', value: '24', color: 'bg-red-100 text-red-600' },
    { icon: BarChart2, label: 'Total Reports', value: '156', color: 'bg-blue-100 text-blue-600' },
    { icon: AlertTriangle, label: 'High Priority', value: '8', color: 'bg-yellow-100 text-yellow-600' },
    { icon: Clock, label: 'Avg Response Time', value: '32min', color: 'bg-green-100 text-green-600' },
  ];

  const recentActivity = [
    { id: 1, type: 'New Report', description: 'Theft reported in Downtown', time: '5 minutes ago' },
    { id: 2, type: 'Status Update', description: 'Case #1234 marked as resolved', time: '15 minutes ago' },
    { id: 3, type: 'New User', description: 'Officer Smith joined the team', time: '1 hour ago' },
    { id: 4, type: 'Alert', description: 'High crime activity in West District', time: '2 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/map" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Map className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">View Map</h3>
              <p className="text-sm text-gray-500">Access crime map</p>
            </div>
          </div>
        </Link>
        <Link to="/reports" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">View Reports</h3>
              <p className="text-sm text-gray-500">Check recent reports</p>
            </div>
          </div>
        </Link>
        <Link to="/alerts" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold">View Alerts</h3>
              <p className="text-sm text-gray-500">Check active alerts</p>
            </div>
          </div>
        </Link>
        <Link to="/users" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Manage Users</h3>
              <p className="text-sm text-gray-500">User management</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{activity.type}</h3>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
