import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/user';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loading, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const response = await login(email, password);
    if (response.success === true) {
      const token = response.data?.token;
      const user = response.data?.user;
      Cookies.set('user', JSON.stringify({ token, user }));
      toast.success('Login successful');

      if (user.role === 'USER') {
        navigate('/user-dashboard');
      } else {
        navigate('/');
      }
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center items-center bg-blue-100 text-center p-12">
        <h2 className="text-5xl font-extrabold text-blue-800 mb-6">
          Welcome Back!
        </h2>
        <p className="text-lg text-gray-700 max-w-md leading-relaxed">
          We're glad to see you again. Please log in to access your crime
          reporting dashboard.
        </p>
      </div>
      <div className="flex items-center justify-center px-4">
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md space-y-5 my-10"
        >
          <h2 className="text-4xl font-bold text-center text-gray-800">
            Login
          </h2>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-base"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-base"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
            {loading ? (
              <div className="flex justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              'Login'
            )}
          </motion.button>

          <div className="text-center text-sm mt-4">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 font-medium underline"
            >
              Sign Up
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;
