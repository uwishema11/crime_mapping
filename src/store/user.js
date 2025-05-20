import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,

  login: async (email, password) => {
    console.log("Login:");
    try {
      set({ loading: true, error: null });
      const response = await axios.post(
        "http://localhost:4000/users/auth/login",
        { email, password }
      );
      console.log(response.data);
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      set({ user, token, isAuthenticated: true, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },

  register: async (userData) => {
    try {
      console.log("regsitering")
      set({ loading: true, error: null });
      const response = await axios.post(
        "http://localhost:4000/users/auth/register",
        userData
      );

      set({isAuthenticated: true, loading: false });
      console.log(`response.daata`, response.data);
      return response.data;
    } catch (error) {
      console.log(error)
      set({
        error: error.response?.data?.message || "Registration failed",
        loading: false,
      });

      return {
        success: false,
        message: error.response?.data?.message || "registration failed",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
