import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = import.meta.env.VITE_API_URL;

const useUserDashboardStore = create((set) => ({
  userReports: [],
  reportCount: 0,
  reportStats: [],
  reportsByMonth: [],
  topCrimeAreas: [],
  latestNotification: null,
  loading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      const userCookie = Cookies.get('user');
      if (!userCookie) throw new Error('No user');
      const { token } = JSON.parse(userCookie);

      // Fetch all user reports
      let userReports = [];
      try {
        const reportRes = await axios.get(
          `${apiUrl}/reports/single-user/my-reports`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        userReports = reportRes?.data?.data?.data || [];
      } catch {
        userReports = [];
      }

      // Fetch grouped by category
      let reportStats = [];
      try {
        const statsRes = await axios.get(`${apiUrl}/reports/user/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        reportStats = Array.isArray(statsRes?.data?.data)
          ? statsRes.data.data
          : [];
      } catch {
        reportStats = [];
      }

      // Fetch grouped by month
      let monthData = [];
      try {
        const monthRes = await axios.get(`${apiUrl}/reports/user/monthly`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          monthRes.data &&
          monthRes.data.data &&
          Object.keys(monthRes.data.data).length > 0
        ) {
          monthData = Object.entries(monthRes.data.data).map(
            ([month, count]) => ({
              month,
              count,
            })
          );
        }
      } catch {
        monthData = [];
      }

      // Fetch top crime areas
      let topCrimeAreas = [];
      try {
        const topCrimes = await axios.get(
          `${apiUrl}/reports/location/top-crime`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        topCrimeAreas = Array.isArray(topCrimes?.data?.data)
          ? topCrimes.data.data
          : [];
      } catch {
        topCrimeAreas = [];
      }

      // Fetch latest notification
      let latestNotification = null;
      try {
        const notifRes = await axios.get(`${apiUrl}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        latestNotification =
          Array.isArray(notifRes?.data?.data) && notifRes.data.data.length > 0
            ? notifRes.data.data[0]
            : null;
      } catch {
        latestNotification = null;
      }

      set({
        userReports,
        reportCount: userReports.length,
        reportStats,
        reportsByMonth: monthData,
        topCrimeAreas,
        latestNotification,
        loading: false,
        error: null,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useUserDashboardStore;
