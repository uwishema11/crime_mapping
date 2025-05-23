import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/user';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm_password: '',
    phone_number: '',
  });
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuthStore();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const response = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirm_password,
      phone_number: formData.phone_number,
    });
    console.log(response);

    if (response.success === true) {
      console.log('registered successfully');

      return toast.success(response.message);
    } else {
      return toast.error(`${response.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md sm:p-8 space-y-4 mt-10 mb-10 "
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-600">
          Create an account
        </h1>
        <p className="font-semibold mb-6 text-center text-gray-600 mb-5">
          Enter your information below to create your account
        </p>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {loading ? 'signing up...' : 'sign up'}
        </button>
        <div className="text-center text-sm mt-4">
          Already have an account?
          <Link to="/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
