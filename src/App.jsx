import React from 'react';

import DashboardLayout from './components/layout/Layout';
import UserLayout from './components/layout/UserLayout';
import { Toaster } from './components/ui/sonner';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/Protected';
import Categories from './components/dashboard/Categories';
import CrimeCategories from './components/dashboard/categories/CrimeCategories';
import Main from './components/dashboard/Main';
import Analytics from './components/dashboard/Analytics';
import UserDashboard from './components/dashboard/UserDashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserReports from './components/dashboard/UserReports';
import SubmitReport from './components/dashboard/SubmitReport';
import CrimeMap from './components/dashboard/CrimeMap';
import Notifications from './components/dashboard/Notifications';
import UsersTable from './components/user/UserTable';
import ReportsTable from './components/dashboard/ReportsTable';
import ReportForm from './components/dashboard/ReportForm';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          className: 'border px-4 py-2 rounded-md shadow-lg',
          success: {
            className: 'bg-green-100 text-green-800 border border-green-300',
          },
          error: {
            className: 'bg-red-100 text-red-800 border border-red-300',
          },
          info: {
            className: 'bg-blue-100 text-blue-800 border border-blue-300',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <DashboardLayout>
                <ReportsTable />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/create"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <DashboardLayout>
                <ReportForm />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/edit/:reportId"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <DashboardLayout>
                <ReportForm />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard/reports"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <UserLayout>
                <ReportsTable isUserView />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard/reports/create"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <UserLayout>
                <ReportForm />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard/reports/edit/:reportId"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <UserLayout>
                <ReportForm />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <DashboardLayout>
                <Main />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/crimes"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <DashboardLayout>
                <CrimeCategories />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <DashboardLayout>
                <UsersTable />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <UserLayout>
                <UserDashboard />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard/categories"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <UserLayout>
                <Categories />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard/crime-map"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <UserLayout>
                <CrimeMap />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard/notifications"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <UserLayout>
                <Notifications />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Navigate to="/" replace />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
