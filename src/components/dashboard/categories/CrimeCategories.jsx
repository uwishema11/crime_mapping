import React, { useState, useEffect } from 'react';
import { Gavel, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import TableComponent from '../TableComponent';
import useCategories from '@/store/useCrimeCategories';
import CategoriesForm from './CategoriesForm';

const CrimeCategories = () => {
  const { categories, fetchCategories, loading, error } = useCategories();
  const [formMode, setFormMode] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpenForm = (mode, category = null) => {
    setFormMode(mode);
    setSelectedCategory(category);
    setOpen(true);
  };

  const handleCloseForm = () => {
    setFormMode(null);
    setSelectedCategory(null);
    setOpen(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (categories.length === 0) return <div>No categories available</div>;

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <div className="font-medium">{row.original.id}</div>,
    },
    { accessorKey: 'name', header: 'Category Name' },
    { accessorKey: 'description', header: 'Description' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.original.status === 'ACTIVE' ? 'text-green-700' : 'text-red-700'
          }`}
        >
          {row.original.status}
        </div>
      ),
    },
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
            onClick={() => console.log('Delete', row.original.id)}
            className="text-red-600 hover:text-red-800 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Detailed Crime Categories</h3>
        <Button
          onClick={() => handleOpenForm('add')}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Add Category
        </Button>
        <TableComponent data={categories} columns={columns} />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="fixed top-0 bottom-0 right-0 h-screen w-full max-w-md bg-white shadow-lg overflow-auto"
        >
          {formMode && (
            <CategoriesForm
              mode={formMode}
              initialData={selectedCategory}
              onClose={handleCloseForm}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CrimeCategories;
