import React, { useState, useEffect } from 'react';
import { FadeLoader } from 'react-spinners';
import { Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent } from '@/components/ui/sheet';
import TableComponent from '../TableComponent';
import { useCrime } from '@/store/crime';
import CrimeForm from './CrimesForm';

const CrimesTable = () => {
  const { crimes, fetchCrimes, loading, error, deleteCrime } = useCrime();
  const [formMode, setFormMode] = useState(null);
  const [selectedCrime, setSelectedCrime] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchCrimes({});
  }, [fetchCrimes]);

  const handleOpenForm = (mode, crime = null) => {
    setFormMode(mode);
    setSelectedCrime(crime);
    setOpen(true);
  };

  const handleCloseForm = () => {
    setFormMode(null);
    setSelectedCrime(null);
    setOpen(false);
  };

  const handleDeleteCrime = async (id) => {
    if (window.confirm('Are you sure you want to delete this crime?')) {
      const response = await deleteCrime(id);
      if (response.success) {
        toast.success('Crime deleted successfully');
      } else {
        toast.error(`Error deleting crime: ${response.message}`);
      }
    }
  };

  if (loading && crimes.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FadeLoader
          size={20}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'crime_name', header: 'Crime Name' },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'location', header: 'Location' },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenForm('edit', row.original)}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-red-600 hover:bg-gray-100 rounded-full cursor-pointer"
            onClick={() =>
              row.original.id !== undefined &&
              handleDeleteCrime(row.original.id)
            }
            aria-label="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Crimes</h3>
        <Button
          onClick={() => handleOpenForm('add')}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Add Crime
        </Button>
        <TableComponent data={crimes} columns={columns} />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="fixed top-0 bottom-0 right-0 h-screen w-full max-w-md bg-white shadow-lg overflow-auto"
        >
          {formMode && (
            <CrimeForm
              mode={formMode}
              initialData={selectedCrime}
              onClose={handleCloseForm}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CrimesTable;
