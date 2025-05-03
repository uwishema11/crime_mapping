import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentReports = [
  { location: "Downtown", category: "Robbery", time: "2 hours ago" },
  { location: "Uptown", category: "Assault", time: "5 hours ago" },
  { location: "West Side", category: "Theft", time: "1 day ago" },
];

export function RecentCrimeReports() {
  return (
    <Card className="bg-white rounded-lg border-none text-gray-700 ">
      <CardHeader>
        <CardTitle>Recent Crime Reports</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table className="">
          <TableHeader className="text-bold">
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentReports.map((report, index) => (
              <TableRow key={index}>
                <TableCell>{report.location}</TableCell>
                <TableCell>{report.category}</TableCell>
                <TableCell>{report.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
