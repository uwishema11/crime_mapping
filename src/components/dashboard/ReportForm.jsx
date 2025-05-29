import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import useReportsStore from '../../store/reports';
import axios from 'axios';

const ReportForm = () => {
  const { formMode, editingReport, closeReportForm } = useReportsStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/categories`
        );
        setCategories(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch categories');
      }
    };

    fetchCategories();
    if (formMode === 'edit' && editingReport) {
      setValue('crimeName', editingReport.crimeName);
      setValue('categoryName', editingReport.categoryName);
      setValue('description', editingReport.description);
      setValue('location', editingReport.location);
      setValue(
        'incidentDate',
        new Date(editingReport.incidentDate).toISOString().split('T')[0]
      );
      setValue('contactNumber', editingReport.contactNumber);
    }
  }, [formMode, editingReport, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (formMode === 'edit') {
        console.log('Editing report:', editingReport);
        await useReportsStore.getState().updateReport(editingReport.id, data);
        toast.success('Report updated successfully');
      } else {
        await useReportsStore.getState().createReport(data);
        toast.success('Report created successfully');
      }
      closeReportForm();
    } catch (error) {
      toast.error(error.message || 'Failed to save report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">
        {formMode === 'edit' ? 'Edit Report' : 'Create New Report'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="crimeName">Crime Name</Label>
          <Input
            id="crimeName"
            {...register('crimeName', { required: 'Crime name is required' })}
            placeholder="Enter crime name"
          />
          {errors.crimeName && (
            <p className="text-red-500 text-sm">{errors.crimeName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryName">Category</Label>
          <div className="relative z-10">
            <Select
              onValueChange={(value) => setValue('categoryName', value)}
              defaultValue={editingReport?.categoryName}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" className="z-50 bg-white border border-gray-300 rounded-md shadow-lg">
                {categories.map((category) => (
                  <SelectItem
                    key={category._id}
                    value={category.name}
                    className="text-gray-900 font-bold"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.categoryName && (
            <p className="text-red-500 text-sm">
              {errors.categoryName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description', {
              required: 'Description is required',
            })}
            placeholder="Enter description"
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register('location', { required: 'Location is required' })}
            placeholder="Enter location"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="incidentDate">Incident Date</Label>
          <Input
            id="incidentDate"
            type="date"
            {...register('incidentDate', {
              required: 'Incident date is required',
            })}
          />
          {errors.incidentDate && (
            <p className="text-red-500 text-sm">
              {errors.incidentDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            {...register('contactNumber', {
              required: 'Contact number is required',
            })}
            placeholder="Enter contact number"
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-sm">
              {errors.contactNumber.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={closeReportForm}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? 'Saving...'
              : formMode === 'edit'
                ? 'Update Report'
                : 'Create Report'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
