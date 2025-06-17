import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';
const apiUrl = import.meta.env.VITE_API_URL;

const useReportsStore = create((set) => ({
  reports: [],
  recentReports: [],
  loading: false,
  pendingState: false,
  totalPendingReports: 0,
  totalNumOfReports: 0,
  filter: '',
  search: '',
  isFilterOpen: false,
  isReportFormOpen: false,
  editingReport: null,
  error: null,
  totalReports: 0,
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
      isReportFormOpen: true,
      formMode: mode,
      editingReport: mode === 'edit' ? report : null,
    }),

  closeReportForm: () =>
    set({
      isReportFormOpen: false,
      editingReport: null,
      formMode: 'add',
    }),

  fetchReports: async (params) => {
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
        `${apiUrl}/reports/all?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({
        reports: response.data.data,
        totalReports: response.data.total,
        totalNumOfReports: response.data.data.length,
        pagination: {
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        },
        loading: false,
      });
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching reports:',
        error.response?.data || error.message
      );
      set({
        error: error.response?.data?.message || 'Failed to fetch reports',
        loading: false,
      });
      throw error;
    }
  },
  fetchUserReports: async (params = {}) => {
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
        `${apiUrl}/reports/single-user/my-reports?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({
        reports: response.data.data.data,
        totalReports: response.data.total,
        pagination: {
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.data.pagination.totalPages,
        },
        loading: false,
      });
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching user reports:',
        error.response?.data || error.message
      );
      set({
        error: error.response?.data?.message || 'Failed to fetch reports',
        loading: false,
      });
      throw error;
    }
  },
  fetchPendingReports: async () => {
    set({ pendingState: true, error: false });
    try {
      const userCookie = Cookies.get('user');
      if (!userCookie) throw new Error('No authentication token found');
      const { token } = JSON.parse(userCookie);

      const res = await axios.get(`${apiUrl}/reports/grouped/pending-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`this is pending data`, res.data.data);
      set({
        pendingState: false,
        error: false,
        totalPendingReports: res.data.data.length,
      });
      console.log(res.data.data);
      return res.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Failed to load data. Try again';
      set({ loadingFetch: false, error: message });
      return {
        success: false,
        message: message,
      };
    }
  },
  createReport: async (reportData) => {
    set({ loading: true, error: null });
    try {
      const userCookie = Cookies.get('user');
      if (!userCookie) {
        throw new Error('No authentication token found');
      }
      const { token } = JSON.parse(userCookie);

      const response = await axios.post(
        `${apiUrl}/reports/create`,
        reportData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      set((state) => ({
        reports: [response.data.data, ...state.reports],
        totalReports: state.totalReports + 1,
        loading: false,
      }));
      console.log('Report created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'Error creating report:',
        error.response?.data || error.message
      );
      set({
        error: error.response?.data?.message || 'Failed to create report',
        loading: false,
      });
      throw error;
    }
  },

  // Update report
  updateReport: async (reportId, reportData) => {
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
      throw error;
    }
  },
  updateReportStatus: async (reportId, status) => {
    set({ loading: true, error: null });
    try {
      const userCookie = Cookies.get('user');
      if (!userCookie) {
        throw new Error('No authentication token found');
      }
      const { token } = JSON.parse(userCookie);
      const response = await axios.patch(
        `${apiUrl}/reports/update/status/${reportId}`,
        { status }, // status should be a string, e.g., "RESOLVED"
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      set((state) => ({
        reports: state.reports.map((report) =>
          report.id === reportId
            ? { ...report, status: response.data.data.updatedReport.status }
            : report
        ),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || 'Failed to update report status',
        loading: false,
      });
      throw error;
    }
  },

  fetchRecentReports: async () => {
    try {
      const useCookie = Cookies.get('user');
      if (!useCookie) {
        set({ loadingFetch: false, error: 'No authentication token found' });
      }
      const { token } = JSON.parse(useCookie);
      set({ loadingFetch: true, error: null });
      const response = await axios.get(`${apiUrl}/reports/recents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({
        recentReports: response.data.data,
        loadingFetch: false,
        error: null,
      });
      return {
        success: true,
        message: 'Recent reports fetched successfully',
        data: response.data.data,
      };
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

export default useReportsStore;
