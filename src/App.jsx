import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Main from './components/dashboard/Main';
import MapView from './components/dashboard/MapView';
import Analytics from './components/dashboard/Analytics';
import Reports from './components/dashboard/Reports';
import Users from './components/dashboard/Users';
import Alerts from './components/dashboard/Alerts';
import Settings from './components/dashboard/Settings';
import ReportForm from './components/dashboard/ReportForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="map" element={<MapView />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/new" element={<ReportForm />} />
          <Route path="users" element={<Users />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
