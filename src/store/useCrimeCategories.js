import { create } from 'zustand';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const useCategories = create((set) => ({
  categories: [],
  loading: false,
  error: null,
  formMode: 'add', // 'add' or 'edit'
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
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  editCategory: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${apiUrl}/categories/${id}`, data);
      const updatedCategory = response.data.data;
      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? updatedCategory : category
        ),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useCategories;
