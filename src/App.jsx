import DashboardLayout from "./components/dashboard/layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/dashboard/Main";

import React from "react";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Main />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </div>
  );
}
