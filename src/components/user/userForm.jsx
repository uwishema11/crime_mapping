import { useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { UploadCloud } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import useUserStore from '@/store/user';
import { userSchema } from '@/validation/userSchema';

export const UserForm = ({ initialValues = {} }) => {
  const {
    closeUserForm,
    formMode,
    loaddingAdd,
    loading,
    loaddingUpdate,
    error,
    register,
    updateUser,
  } = useUserStore();

  const [formData, setFormData] = useState({
    id: initialValues.id ?? 0,
    firstName: initialValues.firstName || '',
    lastName: initialValues.lastName || '',
    email: initialValues.email || '',
    password: initialValues.password || '',
    confirm_password: initialValues.confirm_password || '',
    role: initialValues.role || 'USER',
    image_url: initialValues.image_url || undefined,
  });

  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(
    typeof initialValues.image_url === 'string' ? initialValues.image_url : ''
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
        setFormData((prev) => ({
          ...prev,
          image_url: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedData = userSchema.parse(formData);
      setErrors({});
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('confirm_password', formData.confirm_password);
      if (formData.image_url instanceof File) {
        formDataToSend.append('image_url', formData.image_url);
      }

      if (formMode === 'add') {
        const response = await register(formDataToSend);
        if (response.success === true) {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirm_password: '',
            role: 'USER',
            image_url: undefined,
          });
          setPreviewUrl('');
          toast.success(
            'User registered successfully! Check your email to verify your account'
          );
          closeUserForm();
        } else {
          toast.error(response.message);
        }
      } else {
        if (formData.id !== undefined) {
          const userData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirm_password,
            image_url:
              formData.image_url instanceof File
                ? undefined
                : formData.image_url,
          };

          const response = await updateUser(formData.id, userData);
          if (response.data) {
            toast.success(response.message);
            closeUserForm();
          } else {
            toast.error(error);
          }
        } else {
          toast.error(error);
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div
        className="absolute inset-0 bg-opacity-30"
        onClick={closeUserForm}
      ></div>
      <div className="relative w-full max-w-md h-full bg-white shadow-lg p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">
          {formMode === 'edit' ? 'Edit User' : 'Add New User'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="flex flex-col items-center mb-8">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            )}
            <Label className="mt-4 flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md cursor-pointer">
              <UploadCloud size={20} />
              <span>Upload Image</span>
              <Input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`mt-1 block w-full border p-2 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`mt-1 block w-full border p-2 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full border p-2 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          {formMode === 'add' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 block w-full border p-2 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className={`mt-1 block w-full border p-2 ${
                    errors.confirm_password
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md shadow-sm`}
                />
                {errors.confirm_password && (
                  <p className="text-red-500 text-sm">
                    {errors.confirm_password}
                  </p>
                )}
              </div>
            </>
          )}
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
          <button
            type="button"
            className="w-full py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            onClick={closeUserForm}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
