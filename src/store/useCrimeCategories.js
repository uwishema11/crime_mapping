import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner';

const apiUrl = import.meta.env.VITE_API_URL;

const useCategories = create((set) => ({
  categories: [],
  loading: false,
  error: null,
  formMode: 'add',
  setFormMode: (mode) => set({ formMode: mode }),

  fetchCategories: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${apiUrl}/categories`);
      console.log('Categories:', response.data.data);
      set({ categories: response.data.data, loading: false, error: null });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addCategory: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${apiUrl}/categories/create`, data);
      const newCategory = response.data.data;
      set((state) => ({
        categories: [...state.categories, newCategory],
        loading: false,
      }));
      toast('succfully');
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  editCategory: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${apiUrl}/categories/${id}`, data);
      console.log(response);
      const updatedCategory = response.data.data;
      console.log(updatedCategory);
      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? updatedCategory : category
        ),
        loading: false,
      }));
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error)
      const errorMessage =
        error?.response?.data?.message || 'Something went wrong!';
      set({ error: errorMessage, loading: false });
      return {
        success: false,
        message: errorMessage,
      };
    }
  },
}));

export default useCategories;
