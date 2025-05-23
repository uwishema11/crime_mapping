import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const recentReports = [
  { location: 'Downtown', category: 'Robbery', time: '2 hours ago' },
  { location: 'Uptown', category: 'Assault', time: '5 hours ago' },
  { location: 'West Side', category: 'Theft', time: '1 day ago' },
];

export function CrimeTable() {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Recent Reports</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentReports.map((report, i) => (
            <TableRow key={i}>
              <TableCell>{report.location}</TableCell>
              <TableCell>{report.category}</TableCell>
              <TableCell>{report.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
