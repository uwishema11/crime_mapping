import DashboardLayout from "./components/layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/dashboard/Main";
import Analytics from "./components/dashboard/Analytics";
import CrimeCategories from "./components/dashboard/CrimeCategories";

import React from "react";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="crime-categories" element={<CrimeCategories />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </div>
  );
}
