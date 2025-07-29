import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  SheetHeader,
  SheetDescription,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { z } from 'zod';

const crimeValidation = z.object({
  crimeName: z.string().min(2, 'Crime name is required'),
  description: z.string().min(2, 'Description is required'),
  location: z.string().min(2, 'Location is required'),
  status: z.string()
});

import { useCrime } from '@/store/crime';

export default function CrimeForm({ mode, initialData, onClose }) {
  const { addCrime, editCrime, loading } = useCrime();
  const [formData, setFormData] = useState({
    id: '',
    crimeName: '',
    description: '',
    location: '',
    status: 'PENDING',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({ ...initialData });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedData = crimeValidation.parse(formData);
      if (mode === 'add') {
        const response = await addCrime(parsedData);
        if (response.data) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await editCrime(formData.id, parsedData);
        if (response.data) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
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
      <SheetHeader>
        <SheetTitle>{mode === 'edit' ? 'Edit Crime' : 'Add Crime'}</SheetTitle>
        <SheetDescription>
          {mode === 'edit'
            ? 'Edit the crime details below.'
            : 'Fill in the details to create a new crime.'}
        </SheetDescription>
      </SheetHeader>
      <form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="crimeName">Crime Name</Label>
          <input
            type="text"
            name="crimeName"
            id="crimeName"
            value={formData.crimeName}
            onChange={handleChange}
            className="mt-1 block w-full border p-3 rounded-md"
          />
          {errors.crimeName && (
            <p className="text-red-500 text-sm">{errors.crimeName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border p-3 rounded-md"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full border p-3 rounded-md"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full border p-3 rounded-md"
          >
            <option value="PENDING">PENDING</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
        <SheetFooter className="mt-5 flex">
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
              type="button"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
              onClick={onClose}
            >
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </div>
  );
}
