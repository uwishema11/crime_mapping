import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

export default function UserReports() {
  const reports = [
    {
      id: 1,
      title: 'Suspicious Activity',
      category: 'Theft',
      status: 'Under Review',
      date: '2024-03-15',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Reports</h1>
        <Link to="/user-dashboard/submit-report">
          <Button className="flex items-center gap-2">
            <PlusCircle size={16} />
            Submit New Report
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.title}</TableCell>
                <TableCell>{report.category}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      report.status === 'Under Review'
                        ? 'bg-yellow-100 text-yellow-800'
                        : report.status === 'Resolved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {report.status}
                  </span>
                </TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
