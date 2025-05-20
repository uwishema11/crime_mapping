import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>My Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">View and manage your submitted crime reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crime Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">View crime statistics in your area</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Safety Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Important safety information and guidelines</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 