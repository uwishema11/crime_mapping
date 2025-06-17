import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = import.meta.env.VITE_API_URL;
const userToken = Cookies.get('user');
let token;

if (userToken) {
  const parsedUser = JSON.parse(userToken);
  const user = parsedUser.token;
  token = user;
}

export const useCrime = create((set) => ({
  crimes: [],
  recentCrimes: [],
  groupedCrimesBYMonth: [],
  groupedCrimesBYLocation: [],
  groupedCrimesBYName: [],
  topCrimeLocation: null,

  loading: false,
  filter: '',
  search: '',
  isFilterOpen: false,
  isReportCrimeOpen: false,
  editingCrime: null,
  error: null,
  totalCrimes: 0,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  page: 1,
  limit: 10,
  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  toggleFilterDropdown: () =>
    set((state) => ({ isFilterOpen: !state.isFilterOpen })),

  openReportForm: (mode, report) =>
    set({
      isReportCrimeOpen: true,
      formMode: mode,
      editingCrime: mode === 'edit' ? crime : null,
    }),

  closeCrimeForm: () =>
    set({
      isReportCrimeOpen: false,
      editingCrime: null,
      formMode: 'add',
    }),

  fetchCrimes: async (params) => {
    const { filter, search, page, limit } = params;
    const userCookie = Cookies.get('user');
    if (!userCookie) throw new Error('No authentication token found');
    const { token } = JSON.parse(userCookie);
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (filter) queryParams.append('filter', filter);
      if (search) queryParams.append('search', search);

      const response = await axios.get(
        `${apiUrl}/crimes?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({
        crimes: response.data.data,
        totalCrimes: response.data.total,
        pagination: {
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        },
        loading: false,
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching crimes:',
        error.response?.data || error.message
      );
      set({
        error: error.response?.data?.message || 'Failed to fetch crimes',
        loading: false,
      });
      throw error;
    }
  },
  fetchGroupedByMonth: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(
        `${apiUrl}/crimes/grouped/monthAndType`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({
        loading: false,
        error: null,
        groupedCrimesBYMonth: response.data.data,
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Something went wrong!';
      set({ loading: false, error: errorMessage });
      return {
        success: false,
        message: errorMessage,
        data: [],
      };
    }
  },
  fetchGroupedByName: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${apiUrl}/crimes/grouped/crime-name`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({
        loading: false,
        error: null,
        groupedCrimesBYName: response.data.data,
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Something went wrong!';
      set({ loading: false, error: errorMessage });
      return {
        success: false,
        message: errorMessage,
        data: [],
      };
    }
  },
  fetchGroupedByLocation: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${apiUrl}/crimes/grouped/location`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({
        loading: false,
        error: null,
        groupedCrimesBYLocation: response.data.data,
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Something went wrong!';
      set({ loading: false, error: errorMessage });
      return {
        success: false,
        message: errorMessage,
        data: [],
      };
    }
  },

  // Update crime
  updateCrime: async (crimeId, crimeData) => {
    set({ loading: true, error: null });
    try {
      const userCookie = Cookies.get('user');
      if (!userCookie) {
        throw new Error('No authentication token found');
      }
      const { token } = JSON.parse(userCookie);

      const response = await axios.patch(
        `${apiUrl}/reports/edit/${reportId}`,
        reportData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      set((state) => ({
        reports: state.reports.map((report) =>
          report.id === reportId ? response.data.data : report
        ),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      console.error(
        'Error updating report:',
        error.response?.data || error.message
      );
      set({
        error: error.response?.data?.message || 'Failed to update report',
        loading: false,
      });
      return {
        success: false,
        message: message,
        data: [],
      };
    }
  },
  // fetch recent reports
  fetchRecentCrimes: async () => {
    try {
      const useCookie = Cookies.get('user');
      if (!useCookie) {
        set({ loadingFetch: false, error: 'No authentication token found' });
      }
      const { token } = JSON.parse(useCookie);
      set({ loadingFetch: true, error: null });
      const response = await axios.get(`${apiUrl}/crimes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        recentCrimes: response.data.data,
        loadingFetch: false,
        error: null,
      });
      return {
        success: true,
        message: 'Recent crimes fetched successfully',
        data: response.data.data,
      };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        'Failed to load crimes! Check your network';
      set({ loadingFetch: false, error: message });
      return {
        success: false,
        message: message,
        data: [],
      };
    }
  },

  // location with  most crimes
  fetchTopCrimeLocation: async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/crimes/location/top-crime-location`
      );
      set({ topCrimeLocation: response.data.data.location });
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Failed to fetch top crime location';
      set({ topCrimeLocation: null });
      return {
        success: false,
        message,
      };
    }
  },

  // Delete report
  deleteReport: async (id) => {
    set({ loading: true, error: null });
    try {
      const userCookie = Cookies.get('user');
      if (!userCookie) {
        throw new Error('No authentication token found');
      }
      const { token } = JSON.parse(userCookie);

      await axios.delete(`${apiUrl}/reports/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        reports: state.reports.filter((report) => report.id !== id),
        totalReports: state.totalReports - 1,
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      console.error(
        'Error deleting report:',
        error.response?.data || error.message
      );
      set({
        error: error.response?.data?.message || 'Failed to delete report',
        loading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
