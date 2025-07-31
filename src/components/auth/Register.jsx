
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/user';

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
  const { register, loading, clearError } = useAuthStore();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const response = await register(formData);

    if (response.success === true) {
      toast.success(response.message);
      navigate('/login');
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center items-center bg-blue-100 p-12 text-center">
        <h2 className="text-5xl font-extrabold text-blue-800 mb-6">Join Us!</h2>
        <p className="text-lg text-gray-700 max-w-md leading-relaxed">
          Create your account and become part of a platform that helps keep your
          community safe. 👮‍♀️📱
        </p>
      </div>
      <div className="flex items-center justify-center px-4">
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md space-y-5 my-10"
        >
          <h1 className="text-4xl font-bold text-center text-blue-700 mb-2">
            Create Account
          </h1>
          <p className="text-center text-gray-500 text-sm mb-4">
            Sign up to start reporting and tracking community issues.
          </p>

          {[
            { name: 'firstName', label: 'First Name' },
            { name: 'lastName', label: 'Last Name' },
            { name: 'email', label: 'Email Address' },
            { name: 'phone_number', label: 'Phone Number' },
            { name: 'password', label: 'Password' },
            { name: 'confirm_password', label: 'Confirm Password' },
          ].map(({ name, label }) => (
            <div key={name} className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type={name.includes('password') ? 'password' : 'text'}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-base"
              />
            </div>
          ))}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </motion.button>

          <div className="text-center text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium underline">
              Login
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Register;
