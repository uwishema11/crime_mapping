import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
const apiUrl = import.meta.env.VITE_API_URL;
const userToken = Cookies.get('user');
let token;

if (userToken) {
  const parsedUser = JSON.parse(userToken);
  const user = parsedUser.token;
  token = user;
}

const useCategories = create((set) => ({
  categories: [],
  loading: false,
  loadingDelete: false,
  loadingAdd: false,
  loadingUpdate: false,
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
      const response = await axios.post(`${apiUrl}/categories/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
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
  deleteCategory: async (id) => {
    console.log('Deleting category with ID:', id);
    set({ loadingDelete: true, error: null });
    try {
      const response = await axios.delete(`${apiUrl}/categories/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        loadingDelete: false,
      }));
      toast.success('Category deleted successfully');
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to delete category';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  },

  editCategory: async (id, data) => {
    set({ loadingUpdate: true, error: null });
    try {
      const response = await axios.patch(
        `${apiUrl}/categories/edit/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      const updatedCategory = response.data.data;
      console.log(updatedCategory);
      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? updatedCategory : category
        ),
        loadingUpdate: false,
      }));
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.response);
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
