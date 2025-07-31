import React, { useEffect } from 'react';
import { FadeLoader } from 'react-spinners';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import { Bell, AlertTriangle } from 'lucide-react';
import useUserDashboardStore from '../../store/userDashboard';

const COLORS = [
  '#1e40af',
  '#3b82f6',
  '#93c5fd',
  '#1d4ed8',
  '#f59e42',
  '#f43f5e',
];

export default function UserDashboard() {
  const {
    userReports,
    reportCount,
    reportStats,
    reportsByMonth,
    latestNotification,
    loading,
    error,
    topCrimeAreas,
    fetchDashboardData,
  } = useUserDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FadeLoader
          size={20}
          color="#3B82F6"
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <p className="text-gray-500 text-sm">Loading your dashboard...</p>
      </div>
      // <div className="h-screen flex items-center justify-center">
      //   <div className="text-center space-y-2">
      //     <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 border-opacity-50"></div>
      //     <p className="text-gray-500 text-sm">Loading your dashboard...</p>
      //   </div>
      // </div>
    );
  }
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-6 py-6">
      <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Total Reports Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700">{reportCount}</p>
            <p className="text-sm text-gray-500">
              {reportCount === 0
                ? "You haven't posted any reports yet."
                : 'Keep tracking your safety reports'}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Latest Notification</CardTitle>
          </CardHeader>
          <CardContent>
            {latestNotification ? (
              <div className="text-sm">
                <div className="font-medium text-blue-700 flex items-center gap-2">
                  <Bell size={16} />
                  {latestNotification.title}
                </div>
                <p className="text-gray-600 mt-1 line-clamp-2">
                  {latestNotification.message}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No new notifications</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Safety Tip</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-700 flex items-start gap-2">
              <AlertTriangle className="text-yellow-500 mt-1" size={20} />
              <span>
                Stay alert when walking alone at night. Stick to well-lit paths
                and avoid shortcuts.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Reports by Category</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 300 }}>
            {reportStats && reportStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportStats}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {reportStats.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500">No data yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Reports Over Time</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 300 }}>
            {reportsByMonth && reportsByMonth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportsByMonth}>
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1d4ed8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500">No data yet</p>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Most Affected Areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topCrimeAreas && topCrimeAreas.length > 0 ? (
              <ul className="text-sm text-gray-700 space-y-1">
                {topCrimeAreas.map((area, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <div>
                      📍 <span className="font-semibold">{area.location}</span>
                      <span className="ml-1">– {area.topCrime}</span>
                    </div>
                    <span className="text-blue-600 font-bold">
                      {area.count}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No area data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mt-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>How to Report a Crime</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Go to the "My Reports" section, click "New Report", select
              category, describe the incident, and submit.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>📞 Police: 112</li>
              <li>🚑 Ambulance: 912</li>
              <li>🆘 Local Authority: 1001</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
