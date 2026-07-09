

import Sidebar from "../components/sidebar/sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-[#0b0b0b]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;