import React from 'react';
import { useEffect, useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FadeLoader } from 'react-spinners';
import useReportsStore from '@/store/reports';

export function CrimeTable() {
  const { fetchRecentReports, loadingFetch, recentReports } = useReportsStore();

  useEffect(() => {
    fetchRecentReports();
  }, []);

  if (loadingFetch) {
    return (
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Recent Reports</h2>
        <div className="flex items-center justify-center h-screen">
          <FadeLoader
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      </div>
    );
  }
  if (!recentReports || recentReports.length === 0) {
    console.log(recentReports);
    return (
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Recent Reports</h2>
        <p className="text-gray-500">No recent reports available.</p>
      </div>
    );
  }
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Recent Reports</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location</TableHead>
            <TableHead>Crime</TableHead>
            <TableHead>Victim</TableHead>
            <TableHead>Desscription</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Incident-Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentReports.map((report, i) => (
            <TableRow key={i}>
              <TableCell>{report.location}</TableCell>
              <TableCell>{report.crimeName}</TableCell>
              <TableCell>{report.userId}</TableCell>
              <TableCell>{report.description}</TableCell>
              <TableCell>{report.categoryName}</TableCell>
              <TableCell>
                {new Date(report.incidentDate).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
