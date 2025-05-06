import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FadeLoader } from 'react-spinners';
import { Button } from '../ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Search, Plus, PenLine, Trash2 } from 'lucide-react';
import useReportsStore from '../../store/reports';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import TableComponent from '../Table';
import ReportForm from './ReportForm';

const ReportsTable = ({ isUserView = false }) => {
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const {
    reports,
    loading,
    error,
    totalReports,
    isReportFormOpen,
    openReportForm,
    closeReportForm,
    editingReport,
    toggleFilterDropdown,
    isFilterOpen,
    filter,
    search,
    setSearch,
    setFilter,
    setPage,
    setLimit,
    page,
    limit,
    pagination,
    fetchReports,
    fetchUserReports,
    deleteReport,
  } = useReportsStore();

  // Initial fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isUserView) {
          await fetchUserReports({ page, limit });
        } else {
          await fetchReports({ page, limit });
        }
        setIsInitialLoad(false);
      } catch (error) {
        toast.error('Failed to load reports');
        setIsInitialLoad(false);
      }
    };
    fetchData();
  }, []);

  // Handle search changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        if (isUserView) {
          await fetchUserReports({ page, limit, search, filter });
        } else {
          await fetchReports({ page, limit, search, filter });
        }
      } catch (error) {
        toast.error('Failed to update reports');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, filter, page, limit]);

  const handleDelete = async (id) => {
    console.log('deleteing report with id', id);
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(id);
        toast.success('Report deleted successfully');
        if (isUserView) {
          await fetchUserReports({ page, limit, search, filter });
        } else {
          await fetchReports({ page, limit, search, filter });
        }
      } catch (error) {
        toast.error(error.message || 'Failed to delete report');
      }
    }
  };

  const handleEdit = (report) => {
    if (!isClosing) {
      openReportForm('edit', report);
    }
  };

  const handleCreate = () => {
    if (!isClosing) {
      console.log('openung report');
      openReportForm('add');
    }
  };

  if (isInitialLoad && loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FadeLoader color="#3B82F6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Error loading reports</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="rounded-lg p-4 bg-white">
        <h1 className="text-gray-700 font-bold text-3xl mb-6">
          {isUserView ? 'My Reports' : 'All Reports'}
        </h1>

        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Sheet open={isReportFormOpen}>
            <SheetTrigger asChild>
              <Button onClick={() => openReportForm('add')}>Add Report</Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="fixed z-50 bg-white shadow-lg overflow-y-auto p-6"
            >
              <ReportForm />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center text-gray-500">
            <p className="text-lg font-semibold">you do not have reports yet</p>
            <p className="text-sm">Create a new report to get started</p>
          </div>
        </div>
      </div>
    );
  }

  const reportColumns = [
    { header: 'Crime_Name', accessorKey: 'crimeName' },
    { header: 'Category', accessorKey: 'categoryName' },
    { header: 'Location', accessorKey: 'location' },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ getValue }) => {
        const description = getValue() || '';
        const maxLength = 40;
        const truncated =
          description.length > maxLength
            ? `${description.slice(0, maxLength)}...`
            : description;

        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <span className="cursor-pointer inline-block max-w-[200px] truncate text-ellipsis">
                {truncated}
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="max-w-sm text-sm break-words">
              {description}
            </HoverCardContent>
          </HoverCard>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const status = getValue();
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : status === 'resolved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: 'Date Reported',
      accessorKey: 'createdAt',
      cell: ({ getValue }) => format(new Date(getValue()), 'MMM dd, yyyy'),
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="p-2 text-blue-600 hover:bg-gray-100 rounded-full"
            onClick={() => handleEdit(row.original)}
            aria-label="Edit"
          >
            <PenLine className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-red-600 hover:bg-gray-100 rounded-full"
            onClick={() => handleDelete(row.original.id)}
            aria-label="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];
  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
    if (isUserView) {
      await fetchUserReports({ page, limit, search, filter });
    } else {
      await fetchReports({ page, limit, search, filter });
    }
  };

  const handleLimitChange = async (newLimit) => {
    setLimit(newLimit);
    if (isUserView) {
      await fetchUserReports({ page, limit, search, filter });
    } else {
      await fetchReports({ page, limit, search, filter });
    }
  };
  const handleSearch = async (text) => {
    setSearch(text);
    if (isUserView) {
      await fetchUserReports({ page, limit, search, filter });
    } else {
      await fetchReports({ page, limit, search, filter });
    }
  };
  const handleSetFilfer = async (fil) => {
    setFilter(fil);
    if (isUserView) {
      await fetchUserReports({ page, limit, search, filter });
    } else {
      await fetchReports({ page, limit, search, filter });
    }
  };

  return (
    <div className="rounded-lg p-4 bg-white">
      <h1 className="text-gray-700 font-bold text-3xl mb-6">
        {isUserView ? 'My Reports' : 'All Reports'}
      </h1>

      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto px-4 py-2 bg-[#0A66C2] text-white rounded hover:bg-blue-700"
              onClick={toggleFilterDropdown}
            >
              Filter: {filter}
              {isFilterOpen && (
                <div className="absolute z-10 right-0 mt-2 w-40 bg-white text-black border border-gray-300 rounded shadow-lg">
                  <ul>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSetFilfer('PENDING')}
                    >
                      PENDING
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSetFilfer('UNDER_REVIEW')}
                    >
                      UNDER_REIEW
                    </li>
                  </ul>
                </div>
              )}
            </Button>
          </div>
          <Button
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={handleCreate}
            disabled={isClosing}
          >
            Add Report
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <TableComponent columns={reportColumns} data={reports} />

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page:
            </label>
            <select
              id="rows-per-page"
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {[5, 10, 20, 50].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 rounded ${
                page === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Previous
            </Button>
            <span className="text-sm font-medium">
              {page} of {pagination.totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages}
              className={`px-4 py-2 rounded ${
                page === pagination.totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Sheet
        open={isReportFormOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsClosing(true);
            setTimeout(() => {
              closeReportForm();
              setIsClosing(false);
            }, 200);
          } else {
            openReportForm();
          }
        }}
      >
        <SheetContent
          side="right"
          className="fixed z-50 bg-white shadow-lg overflow-y-auto p-6"
        >
          <ReportForm />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ReportsTable;
