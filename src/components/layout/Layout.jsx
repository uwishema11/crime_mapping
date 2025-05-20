import React from 'react';
import { Toaster } from 'react-hot-toast';

import HeaderDashboard from './HeaderDashboard';
import LeftSectionsDashboard from './LeftSectionDashBoard';

const DashboardLayout = ({ children }) => {
  return (
    <div className="md:grid min-h-screen  w-full grid-cols-[auto_1fr] ">
      <Toaster position="top-right" reverseOrder={false} />
      <LeftSectionsDashboard />
      <div className="flex bg-[#F4F4F4] s flex-col w-full overflow-x-hidden">
        <HeaderDashboard />
        <main className="flex rounded-md  hiddescrollbar flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 max-h-[90vh] overflow-y-scroll">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
