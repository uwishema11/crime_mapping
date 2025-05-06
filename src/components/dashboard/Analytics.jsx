import React from 'react';
import { BarChart2, TrendingUp, Users, AlertTriangle, Map } from 'lucide-react';

const Analytics = () => {
  const stats = [
    {
      title: 'Total Reports',
      value: '70',
      change: '+12.5%',
      trend: 'up',
      icon: BarChart2,
    },
    {
      title: 'Active Cases',
      value: '45',
      change: '-3.2%',
      trend: 'down',
      icon: AlertTriangle,
    },
  ];

  const crimeTypes = [
    { type: 'Theft', count: 450 },
    { type: 'Assault', count: 280 },
    { type: 'Vandalism', count: 320 },
    { type: 'Burglary', count: 190 },
    { type: 'Other', count: 160 },
  ];

  const districts = [
    { name: 'Downtown', incidents: 320 },
    { name: 'West District', incidents: 280 },
    { name: 'East District', incidents: 240 },
    { name: 'North District', incidents: 190 },
    { name: 'South District', incidents: 170 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <h3 className="text-2xl font-semibold mt-1">{stat.value}</h3>
                </div>
                <div
                  className={`p-3 rounded-full ${
                    stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  />
                </div>
              </div>
              <p
                className={`text-sm mt-2 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change} from last month
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crime Types Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Crime Types Distribution
          </h2>
          <div className="space-y-4">
            {crimeTypes.map((crime, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{crime.type}</span>
                  <span className="font-medium">{crime.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (crime.count /
                          Math.max(...crimeTypes.map((c) => c.count))) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Districts Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Incidents by District</h2>
          <div className="space-y-4">
            {districts.map((district, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{district.name}</span>
                  <span className="font-medium">{district.incidents}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (district.incidents /
                          Math.max(...districts.map((d) => d.incidents))) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
