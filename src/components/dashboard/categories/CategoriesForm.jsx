import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { categoryValidation } from '@/validations/categories';
import { Button } from '@/components/ui/button';
import {
  SheetHeader,
  SheetDescription,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import useCategories from '@/store/useCrimeCategories';

export default function CategoriesForm({ mode, initialData, onClose }) {
  const { addCategory, editCategory, loading } = useCategories();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    crimes: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({ ...initialData, crimes: initialData.crimes || [] });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const parsedData = categoryValidation.parse(formData);
      if (mode === 'add') {
        const response = await addCategory(parsedData);
        if (response.data) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await editCategory(formData.id, parsedData);
        console.log(response);
        if (response.data) {
          return toast.success(response.message);
        } else {
          return toast.error(response.message);
        }
      }
      setErrors({});
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0]] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <SheetHeader className="flex flex-col items-start justify-start w-full">
        <SheetTitle className="text-lg font-semibold text-gray-800">
          {mode === 'edit' ? 'Edit Category' : 'Add Category'}
        </SheetTitle>
        <SheetDescription>
          {mode === 'edit'
            ? 'Make changes to the crime categories details here.'
            : 'Fill in the details to create a new category.'}
        </SheetDescription>
      </SheetHeader>
      <form onSubmit={handleSubmit}>
        <div>
          <Label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name
          </Label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter category name"
            className="mt-1 block w-full border p-3 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div>
          <Label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </Label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="mt-1 block w-full border p-3 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>
        <SheetFooter className="mt-5 flex ">
          <Button
            type="submit"
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </Button>
          <SheetClose asChild>
            <Button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
            >
              Cansel Changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </div>
  );
}
