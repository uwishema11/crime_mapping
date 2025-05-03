import DashboardLayout from "./components/layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CategoriesPage from "./components/dashboard/CrimeCategories";

import Main from "./components/dashboard/Main";

import React from "react";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/categories" element={<CategoriesPage />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </div>
  );
}
