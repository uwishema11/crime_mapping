import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = import.meta.env.VITE_API_URL;

const useAuthStore = create((set) => ({
  loading: false,
  isAuthenticated: false,
  isAdmin: false,
  error: null,
  verifyToken: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${apiUrl}/auth/verify-token`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data}`,
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        'something went wrong! check your internet and try again';
      console.log(error?.response?.data?.message);
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
