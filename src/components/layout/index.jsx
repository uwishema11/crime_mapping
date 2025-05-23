import DashboardLayout from './components/layout/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/dashboard/Main';
import Analytics from './components/dashboard/Analytics';

import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="analytics" element={<Analytics />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </div>
  );
}
