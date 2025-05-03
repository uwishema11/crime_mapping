import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const crimeTrendsData = [
  {
    month: "January",
    Theft: 120,
    Assault: 80,
    Burglary: 60,
    Fraud: 90,
    Other: 50,
  },
  {
    month: "February",
    Theft: 100,
    Assault: 70,
    Burglary: 50,
    Fraud: 85,
    Other: 40,
  },
  {
    month: "March",
    Theft: 110,
    Assault: 75,
    Burglary: 55,
    Fraud: 88,
    Other: 45,
  },
  {
    month: "April",
    Theft: 130,
    Assault: 85,
    Burglary: 65,
    Fraud: 95,
    Other: 55,
  },
  {
    month: "May",
    Theft: 140,
    Assault: 90,
    Burglary: 70,
    Fraud: 100,
    Other: 60,
  },
];

export function CrimeTrendsChart() {
  return (
    <Card className="flex flex-col w-[500] h-auto bg-white rounded-lg border-none text-gray-700">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-base">Crime Trends Over Time</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <LineChart
          width={600}
          height={300}
          data={crimeTrendsData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Theft" stroke="hsl(var(--chart-1))" />
          <Line
            type="monotone"
            dataKey="Assault"
            stroke="hsl(var(--chart-2))"
          />
          <Line
            type="monotone"
            dataKey="Burglary"
            stroke="hsl(var(--chart-3))"
          />
          <Line type="monotone" dataKey="Fraud" stroke="hsl(var(--chart-4))" />
          <Line type="monotone" dataKey="Other" stroke="hsl(var(--chart-5))" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
