import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';

const useAuthStore = create((set) => ({
  loading: false,
  isAuthenticated: false,
  isAdmin: false,
  error: null,
  verifyToken: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        'http://localhost:4000/auth/verify-token',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Something went wrong!';
      set({ loading: false, error: errorMessage });
      return {
        success: false,
        message: errorMessage,
      };
    }
  },
  logout: () => {
    Cookies.remove('user');
    set({ isAuthenticated: false, isAdmin: false, loading: false });
  },
}));

export default useAuthStore;
