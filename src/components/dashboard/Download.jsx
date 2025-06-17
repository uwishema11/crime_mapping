import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import Cookies from 'js-cookie';

import useReportsStore from '@/store/reports';

export default function DownloadButton() {
  const {
    reports,
    loading,
    error,
    totalNumOfReports,
    fetchUserReports,
    fetchReports,
  } = useReportsStore();

  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [isUserView, setIsUserView] = useState(true);

  useEffect(() => {
    // Detect user role from cookie
    const userCookie = Cookies.get('user');
    let role = 'USER';
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        role = user.role || 'USER';
      } catch {}
    }
    setIsUserView(role === 'USER');
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isUserView) {
          await fetchUserReports({});
        } else {
          await fetchReports({});
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to load reports');
      }
    };
    fetchData();
  }, [isUserView, fetchUserReports, fetchReports]);

  const handleDownload = () => {
    switch (selectedFormat) {
      case 'pdf':
        downloadPDF();
        break;
      case 'excel':
        downloadExcel();
        break;
      case 'doc':
        downloadDoc();
        break;
      case 'json':
        downloadJSON();
        break;
      default:
        break;
    }
  };

  const mappedReports = reports.map((r) => ({
    crimeName: r.crimeName,
    categoryName: r.categoryName,
    location: r.location,
    description: r.description,
    status: r.status,
    victim: r.userId,
    createdAt: r.createdAt,
  }));

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Crime Report', 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [
        [
          'Crime Name',
          'Category',
          'Location',
          'Description',
          'Status',
          'Victim',
          'Date Reported',
        ],
      ],
      body: mappedReports.map((r) => [
        r.crimeName,
        r.categoryName,
        r.location,
        r.description,
        r.status,
        r.victim,
        new Date(r.createdAt).toLocaleDateString(),
      ]),
    });
    doc.save('crime_report.pdf');
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(mappedReports);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'crime_report.xlsx');
  };

  const downloadDoc = () => {
    const content = mappedReports
      .map(
        (r) =>
          `Crime Name: ${r.crimeName}, Category: ${r.categoryName}, Location: ${r.location}, Description: ${r.description}, Status: ${r.status}, Date: ${new Date(r.createdAt).toLocaleDateString()}`
      )
      .join('\n\n');
    const blob = new Blob([content], { type: 'application/msword' });
    saveAs(blob, 'crime_report.doc');
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(mappedReports, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, 'crime_report.json');
  };

  return (
    <div className="flex items-center gap-2 mb-6">
      <select
        onChange={(e) => setSelectedFormat(e.target.value)}
        className="border p-1 rounded text-sm"
        value={selectedFormat}
      >
        <option value="pdf">PDF</option>
        <option value="excel">Excel (XLSX)</option>
        <option value="doc">Doc</option>
        <option value="json">JSON</option>
      </select>
      <button
        onClick={handleDownload}
        className="flex items-center gap-1 px-3 py-1 bg-blue-700 text-white text-sm rounded hover:bg-blue-900"
      >
        <Download size={16} /> Download Report
      </button>
    </div>
  );
}
