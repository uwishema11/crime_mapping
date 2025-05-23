import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';
import UserForm from '@/components/user/userForm';

const apiUrl = import.meta.env.VITE_API_URL;
const userToken = Cookies.get('user');
let token;

if (userToken) {
  const parsedUser = JSON.parse(userToken);
  const user = parsedUser.token;
  token = user;
}

const useUserStore = create((set) => ({
  users: [],
  loadingFetch: false,
  loadingDelete: false,
  loaddingAdd: false,
  loaddingUpdate: false,
  loading: false,
  isLoadingState: false,
  error: null,
  filter: 'ACTIVE',
  search: '',
  isFilterOpen: false,
  isUserFormOpen: false,
  editingUser: null,
  formMode: 'add',
  limit: 10,
  page: 1,
  pagination: {
    total: 0,
    per_page: 10,
    page: 1,
    totalPages: 1,
  },
  formData: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm_password: '',
    image_url: '',
  },
  setLimit: (limit) => set({ limit }),
  toggleFilterDropdown: () =>
    set((state) => ({ isFilterOpen: !state.isFilterOpen })),
  closeUserForm: () =>
    set({
      isUserFormOpen: false,
      editingUser: null,
      formMode: 'add',
    }),
  setPage: (page) => set({ page }),
  setFormData: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),
  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),
  openUserForm: (mode, user) =>
    set({
      isUserFormOpen: true,
      formMode: mode,
      editingUser: mode == 'edit' ? user || null : null,
    }),

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post(`${apiUrl}/users/auth/login`, {
        email,
        password,
      });
      const { user, token } = response.data;
      set({ user, token, isAuthenticated: true, loading: false });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          'Login failed! Please check your inernet',
        loading: false,
      });
      return {
        success: false,
        message:
          error.response?.data?.message || 'Login failed, check your internet',
      };
    }
  },

  fetchUsers: async (userParams) => {
    const { filter, search, page, limit } = userParams;
    set({ loadingFetch: true, error: null });
    try {
      const response = await axios.get(
        `${apiUrl}/users?filter=${filter}&search=${search}&page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const pagination = response.data.data.pagination;
      set({
        users: response.data.data.data,
        pagination: pagination,
        error: null,
        loadingFetch: false,
      });
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        'Failed to load users! Check your network';
      set({ loadingFetch: false, error: message });
      return {
        success: false,
        message: message,
        data: [],
      };
    }
  },
  deleteUser: async (id) => {
    set({ loadingDelete: true, error: null });
    try {
      const response = await axios.delete(`${apiUrl}/users/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        loadingDelete: false,
      }));
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Something went wrong!';
      set({ loadingDelete: false, error: errorMessage });
      return {
        success: false,
        message: errorMessage,
      };
    }
  },
  updateUser: async (id, updatedData) => {
    set({ loaddingUpdate: true, error: null });
    try {
      const response = await axios.patch(
        `${apiUrl}/users/update/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, ...response.data.data } : user
        ),
        loaddingUpdate: false,
      }));
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Something went wrong!';
      set({ loaddingUpdate: false, error: errorMessage });
      return {
        success: false,
        message: errorMessage,
      };
    }
  },
  register: async (userData) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post(
        `${apiUrl}/users/auth/register`,
        userData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      set({ isAuthenticated: true, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        loading: false,
      });

      return {
        success: false,
        message: error.response?.data?.message || 'registration failed',
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));

export default useUserStore;
